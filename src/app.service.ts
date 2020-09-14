import { BadRequestException, Injectable } from '@nestjs/common';
import { Satellite, TopSecretRequest } from './dto/top-secret.request';
import { posEmit, TopSecretResponse } from './dto/top-secret.response';

@Injectable()
export class AppService {


  satellitesGlobal: Satellite[] = []

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Obtiene la ubiacion del emisor utilizando la formula de circunferencias, para calcular donde se cruzan todas
   * @param r1 -> distancia (radio) de kenobi
   * @param r2 -> distancia (radio) de skywalker
   * @param r3 -> distancia (radio) de sato
   */
  getLocation(r1,r2,r3): number[] {

    // Kenobi: [-500, -200] ●Skywalker: [100, -100] ●Sato: [500, 100]

    //Kenobi
    const x1 = -500
    const y1 = -200

    // Skywalker
    const x2 = 100
    const y2 = -100

    //Sato
    const x3 = 500
    const y3 = 100


    const A = 2 * x2 - 2 * x1;
    const B = 2 * y2 - 2 * y1;
    const C = Math.pow(r1, 2) - Math.pow(r2, 2) - Math.pow(x1, 2) + Math.pow(x2, 2) - Math.pow(y1, 2) + Math.pow(y2, 2);
    const D = 2 * x3 - 2 * x2;
    const E = 2 * y3 - 2 * y2;
    const F = Math.pow(r2, 2) - Math.pow(r3, 2) - Math.pow(x2, 2) + Math.pow(x3, 2) - Math.pow(y2, 2) + Math.pow(y3, 2);

    // se despeja x , y para calcular la posicion
    const x = (C * E - F * B) / (E * A - B * D);
    const y = (C * D - A * F) / (B * D - A * E);

    return [Number.parseFloat(x.toFixed(2)), Number.parseFloat(y.toFixed(2))];
  }

  /**
   * calcula el mensaje secereto
   * @param phrases
   */
  getMessage(phrases: string[][]): string {

    console.log(phrases);

    console.log('calculando meensaje');
    phrases = this.transposeMatrix(phrases);
    console.log('Transform -> ', phrases);

    let message: string = '';
    if (phrases && phrases.length > 0) {
      for (let i = 0; i < phrases.length; i++) {

        const wordFind: string = AppService.findWord(phrases[i]);
        if (wordFind && wordFind !== '') {
          message = message + ' ' + wordFind
        }

      }
    }

    console.log(message)
    return message.trimStart();

  }

  /**
   * encuentra la palabra del mensaje secreto
   * @param phrase
   */
  private static findWord = (phrase: string[]): string => {
    if (phrase && phrase.length > 0) {
      let word: string;
      for (let i = 0; i < phrase.length; i++) {
        let actualWord = phrase[i];

        if (actualWord) {
          word = actualWord;
        }

        if (i > 0 && word === phrase[-1]) {
          word = phrase[-1];
        }
      }
      return word;
    }
    return '';
  };

  /**
   * convierte filas en columnas
   * @param a
   */
  transposeMatrix(a) {
    return Object.keys(a[0]).map(function(c) {
      return a.map(function(r) {
        return r[c];
      });
    });
  }

  /**
   * Calcular la posicion y el mensaje del emisor.
   * @param topSecretRequest
   */
  async topSecret(topSecretRequest: TopSecretRequest) : Promise<TopSecretResponse> {

    if (!topSecretRequest){
      throw new BadRequestException(null,'Error verifique el request')
    }

    // clean global
    this.satellitesGlobal = []

    const response: TopSecretResponse = new TopSecretResponse();
    try {
      const distances : number [] = []
      const phrases : string [][] = []

      topSecretRequest.satellites.forEach(satellite => {
        distances.push(satellite.distance)
        phrases.push(satellite.message)
      });



      const distanceKenobi = distances[0]
      const distanceSkywalker = distances[1]
      const distanceSato = distances[2]

      const positionEmit : number[] = await this.getLocation(distanceKenobi, distanceSkywalker, distanceSato);

      const position = new posEmit()
      position.x = positionEmit[0]
      position.y = positionEmit[1]

      // set emisor pos
      response.position = position

      // set hidden message
      response.message = this.getMessage(phrases)

    }catch (e) {
      throw new BadRequestException(null,'No hay suficiente información para calcular')
    }

    return response
  }

  /**
   * agrgear satelites en diferenets post.
   * @param satelliteRequest
   */
  async topSecretSplit(satelliteRequest: Satellite) : Promise<boolean> {

    if (satelliteRequest && satelliteRequest.message && satelliteRequest.distance > 0){

      this.satellitesGlobal.push(satelliteRequest);
      return true
    }

    return false

  }

  /**
   * calcular top secret global
   */
  async topSecretGet() : Promise<TopSecretResponse>{

    const topSecretRequest: TopSecretRequest = new TopSecretRequest();

    topSecretRequest.satellites = this.satellitesGlobal;
    return this.topSecret(topSecretRequest)
  }
}
