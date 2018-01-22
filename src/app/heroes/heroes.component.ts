import {Component, OnInit} from '@angular/core';
import {Hero} from '../domain/Hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  title = 'Hello from front';

  heroes: Hero[];

  constructor(private heroService: HeroService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  getGreet(): void {
    // this.heroService.getGreet().then(response => this.title = response);

    this.heroService.getGreet()
      .subscribe(greet => this.title = greet.text());
  }

  add(name: string, superPower: string, description: string): void {
    name = name.trim();
    superPower = superPower.trim();
    description = description.trim();
    if (!name || !superPower) {
      return;
    }
    this.heroService.addHero({name, superPower, description} as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero)
      .subscribe();
  }

  deleteAll(): void {
    this.heroService.deleteAll();
  }

}
