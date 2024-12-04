import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private renderer: Renderer2, private formService: FormService, private productsService: ProductsService, private router: Router) { }

  popularProducts: Product[] = [];

  photos:any = []


  contactName
  contactPhone
  successForm = false

  menuOpened = false;

  isContactOpen = false;

  isButtonVisible = false;

  ngOnInit() {
    this.selectedAdvantage = this.advantages[0]; // Встановлюємо першу перевагу як вибрану

    this.productsService.getProducts({popular:true}).subscribe((data: Product[]) => {
      this.popularProducts = data?.slice(0, 3);
    })

    // Підписуємося на подію NavigationEnd
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Прокручуємо до верху сторінки
        window.scrollTo(0, 0);
        // Закриваємо мобільне меню після переходу на іншу сторінку
        this.closeMenu();
      }
    });

  }

  openBntContact(): void {
    this.isButtonVisible = !this.isButtonVisible; // Змінюємо стан при кожному кліку
  }


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
  

  openContact() {
    this.isContactOpen = true;
    this.closeMenu(); // Закрити мобільне меню
    // Додаємо клас до body для блокування скролу
    this.renderer.addClass(document.body, 'no-scroll');
  }

  closeContact() {
    this.isContactOpen = false;
    // Видаляємо клас, щоб дозволити скрол після закриття форми
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleMenu() {
    this.menuOpened = !this.menuOpened;

    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  advantages = [
    {
      title: 'ВЛАСНЕ ВИРОБНИЦТВО',
      text: 'Ми контролюємо весь процес створення меблів, від розробки до виробництва, забезпечуючи високу якість кожного етапу.',
      image: '../assets/people-work.webp'
    },
    {
      title: 'КОМАНДА МАЙСТРІВ',
      text: 'Працюємо з кожним клієнтом індивідуально, пропонуючи рішення, які максимально відповідають вашим потребам та побажанням.',
      image: '../assets/people-work2.webp'
    },
    {
      title: 'ЯКІСТЬ МЕБЛІВ',
      text: 'Ми використовуємо тільки сертифіковані та безпечні для здоров’я матеріали, турбуючись про ваше благополуччя.',
      image: '../assets/people-work3.webp'
    }
  ];

  selectedAdvantage: any | null = null; // Ініціалізуємо як null

  toggleAdvantage(advantage: any) {
    // Якщо вже вибрана перевага, то приховуємо її
    if (this.selectedAdvantage === advantage) {
      this.selectedAdvantage = null;
    } else {
      this.selectedAdvantage = advantage; // Інакше вибираємо нову перевагу
    }
  }

  selectAdvantage(advantage: any) {
    this.selectedAdvantage = advantage;
  }


  // MOBILE MENU
  isMenuOpen = false;

  closeMenu() {
    this.isMenuOpen = false;
    this.updateBodyScroll();
  }

  navigateToSection(section: string) {
    this.closeMenu(); // Закрити меню
    // Виконати прокрутку до секції
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private updateBodyScroll() {
    if (this.isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isMenuOpen && window.innerWidth > 800) {
      this.closeMenu(); // Закрити меню на великих екранах
    }
  }

  sendContact(){
     this.formService.sendFormData(this.contactName, this.contactPhone).subscribe((response) => {
       this.successForm = true
       setTimeout(() => {
         this.closeContact()
         this.successForm = false
       }, 30000)
     });
  }

  activeButton: string | null = null;

  toggleRotation(button: string) {
    this.activeButton = this.activeButton === button ? null : button;
  }
}
