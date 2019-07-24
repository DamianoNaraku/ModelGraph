import { Component, OnInit } from '@angular/core';
import {Status} from '../app.module';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-mm-graph-html',
  templateUrl: './mm-graph-html.component.html',
  styleUrls: ['./mm-graph-html.component.css']
})
export class MmGraphHtmlComponent implements OnInit {
  constructor() { }
  static graphMain() {
    if (Status.status === null) {
      setTimeout(MmGraphHtmlComponent.graphMain, 1000);
      return; }
    // real main can start
  }
  ngOnInit() {
    MmGraphHtmlComponent.graphMain();
  }
  onLinkClick(event: MatTabChangeEvent) {
    Status.status.getActiveModel().graph.propertyBar.tryUpdatingRaws();
  }

}
