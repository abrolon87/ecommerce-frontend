import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  handleSearch(input: string) {
    console.log(input);
    this.router.navigateByUrl(`/search/${encodeURIComponent(input)}`);
  }
}
