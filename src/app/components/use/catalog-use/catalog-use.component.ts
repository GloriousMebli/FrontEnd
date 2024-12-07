import { Component } from '@angular/core';
import { products } from './catalog-data';

@Component({
  selector: 'app-catalog-use',
  templateUrl: './catalog-use.component.html',
  styleUrl: './catalog-use.component.scss'
})
export class CatalogUseComponent {
  products = products;  // Список продуктів

  // Функція для форматування імені
  formatName(name: string): string {
    if (!name) return 'novyy-tovar'; // Якщо назва порожня, повертаємо стандартну

    const cyrillicToLatinMap = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh',
      з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm',
      н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
      х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ю: 'yu', я: 'ya',
      А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Є: 'Ye', Ж: 'Zh',
      З: 'Z', И: 'Y', І: 'I', Ї: 'Yi', Й: 'Y', К: 'K', Л: 'L', М: 'M',
      Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F',
      Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Shch', Ю: 'Yu', Я: 'Ya',
      "'": '', "’": '', "ʼ": '',
    };

    const transliterate = (text: string): string =>
      text
        .split('')
        .map((char) => cyrillicToLatinMap[char] || char) // Транслітерація
        .join('');

    return transliterate(name)
      .toLowerCase() // Перетворюємо на нижній регістр
      .trim() // Видаляємо зайві пробіли
      .replace(/[/\\]/g, '-') // Заміна "/" і "\" на дефіс
      .replace(/\s+/g, '-') // Заміна пробілів на дефіс
      .replace(/[^a-z0-9-]/g, ''); // Видалення інших небажаних символів
  }
}
