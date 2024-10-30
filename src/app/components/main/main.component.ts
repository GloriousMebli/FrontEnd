import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private renderer: Renderer2, private productsService: ProductsService, private router: Router) { }

  popularProducts: Product[] = [];

  photos:any = []

  menuOpened = false;

  isContactOpen = false;

  ngOnInit() {
    this.selectedAdvantage = this.advantages[0]; // Встановлюємо першу перевагу як вибрану

    this.productsService.getProducts({popular:true}).subscribe((data: Product[]) => {
      this.popularProducts = data;
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
      image: '../assets/people-work.png'
    },
    {
      title: 'КОМАНДА МАЙСТРІВ',
      text: 'Працюємо з кожним клієнтом індивідуально, пропонуючи рішення, які максимально відповідають вашим потребам та побажанням.',
      image: '../assets/people-work2.png'
    },
    {
      title: 'ЯКІСТЬ МЕБЛІВ',
      text: 'Ми використовуємо тільки сертифіковані та безпечні для здоров’я матеріали, турбуючись про ваше благополуччя.',
      image: '../assets/people-work3.png'
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
}
