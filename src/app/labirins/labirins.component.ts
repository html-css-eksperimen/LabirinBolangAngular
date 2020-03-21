import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import Matter from 'matter-js';
import { threadId } from 'worker_threads';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-labirins',
  templateUrl: './labirins.component.html',
  styleUrls: ['./labirins.component.scss']
})
export class LabirinsComponent implements OnInit, OnDestroy {

  Engine = Matter.Engine;
  Render = Matter.Render;
  Runner = Matter.Runner;
  World = Matter.World;
  Bodies = Matter.Bodies;
  Body = Matter.Body;
  Events = Matter.Events;

  startWaktu = new Date().getTime();
  stopWaktu = new Date().getTime();
  isStarted = false;
  isGameSelesai = false;

  totalWaktu = 0;

  cellHorizontal = 10;
  cellVertikal = 12;
  width = window.innerWidth;
  height = window.innerHeight;

  // const unitLengthKotak = width / cellKotak;
  unitLengthX = this.width / this.cellHorizontal;
  unitLengthY = this.height / this.cellVertikal;

  engines = null;
  world = null;
  render = null;

  constructor(
    @Inject(DOCUMENT) private readonly documents: any
  ) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  startTimer() {

  }

  stopTimer() {

  }

  initRenderEngine() {
    this.engines = this.Engine.create();
    this.engines.world.gravity.y = 0;
    this.world = this.engines.world;

    this.render = this.Render.create({
      element: this.documents.body,
      engine: this.engines,
      options: {
        wireframes: false,
        width: this.width,
        height: this.height
      }
    });

    this.Render.run(this.render);
    this.Runner.run(this.Runner.create(), this.engines);
  }

  initPembatasList() {

    // Tembok pembatas kanan kiri
    const pembatasList = [
      this.Bodies.rectangle(this.width / 2, 0, this.width, 2, { isStatic: true }),
      this.Bodies.rectangle(this.width / 2, this.height, this.width, 2, { isStatic: true }),
      this.Bodies.rectangle(0, this.height / 2, 2, this.height, { isStatic: true }),
      this.Bodies.rectangle(this.width, this.height / 2, 2, this.height, { isStatic: true }),
    ];

    this.World.add(this.world, pembatasList);
  }

  acakDataLabirin() {

  }

  hitungLangkahCell(row, column) {

  }

  createGoalPoint() {

  }

  createBallLabirin() {

  }

  cekStatusMenang() {

  }
}
