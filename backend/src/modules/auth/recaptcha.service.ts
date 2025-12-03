import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;

  constructor(private http: HttpService) {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY ?? '';
    if (!this.secretKey) {
      throw new Error('RECAPTCHA_SECRET_KEY no configurada en .env');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: this.secretKey,
          response: token,
        },
      }),
    );

    const data = response.data;
    console.log('reCAPTCHA response:', data); // Para depuración

    // Para reCAPTCHA v2, solo necesitamos success
    return data.success === true;
  }
}
