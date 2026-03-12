import { Pipe, PipeTransform } from '@angular/core';
import { fonticon } from '@nativescript-community/fonticon';

@Pipe({
  name: 'fonticon',
  standalone: true
})

export class FonticonPipe implements PipeTransform {
  transform(value: string): string {
    return fonticon(value);
  }
}