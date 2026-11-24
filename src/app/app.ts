import { Component, OnInit, inject } from '@angular/core';
import { GameService } from './services/game.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private gameService = inject(GameService);

  games: Game[] = [];
  selectedGame: Game | null = null;

  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  selectedGenre = '';
  selectedPlatform = '';

  minPrice: number | null = null;
  maxPrice: number | null = null;

  searchText = '';

  ngOnInit(): void {
    this.loadGames();
  }

  // Cargar videojuegos
  loadGames(): void {
    this.gameService.getGamesPage(
      this.currentPage,
      this.pageSize,
      this.selectedGenre,
      this.selectedPlatform,
      this.minPrice,
      this.maxPrice,
      this.searchText
    ).subscribe(response => {

      this.games = response.body ?? [];

      this.totalItems = Number(
        response.headers.get('X-Total-Count') ?? 0
      );

      this.totalPages = Math.ceil(
        this.totalItems / this.pageSize
      );

    });
  }


  searchById(id: string): void {
    const gameId = Number(id);

    if (!gameId || gameId < 1) {
      this.selectedGame = null;
      return;
    }

    this.gameService.getGame(gameId).subscribe({
      next: game => {
        this.selectedGame = game;
      },
      error: () => {
        this.selectedGame = null;
        alert('No se ha encontrado el videojuego');
      }
    });
  }


  searchByTitle(text: string): void {
    this.searchText = text.trim();
    this.currentPage = 1;
    this.loadGames();
  }


  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadGames();
  }


  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.loadGames();
  }


  applyPriceFilter(min: string, max: string): void {
    this.minPrice = min !== '' ? Number(min) : null;
    this.maxPrice = max !== '' ? Number(max) : null;

    this.currentPage = 1;
    this.loadGames();
  }


  clearFilters(): void {
    this.selectedGenre = '';
    this.selectedPlatform = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.searchText = '';
    this.currentPage = 1;
    this.loadGames();
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGames();
    }
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGames();
    }
  }
}
