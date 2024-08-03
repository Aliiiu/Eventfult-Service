import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateCode(data: string) {
    try {
      return await QRCode.toDataURL(data);
    } catch (error) {
      throw new Error('Error generating QR code');
    }
  }
}
