export class Satellite {
  name:     string;
  distance: number;
  message:  string[];
}

export class TopSecretRequest {
  satellites: Satellite[];
}