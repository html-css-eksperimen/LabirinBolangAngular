import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import * as  Matter from 'matter-js';
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

  cellHorizontal = 14;
  cellVertikal = 12;
  width = window.innerWidth;
  height = window.innerHeight;

  // const unitLengthKotak = width / cellKotak;
  unitLengthX = this.width / this.cellHorizontal;
  unitLengthY = this.height / this.cellVertikal;

  engines = null;
  world = null;
  render = null;

  arrGridKerangka = [];
  arrGrid = [];
  arrVertikalGrid = [];
  arrHorizontalGrid = [];

  startBaris = 0;
  startKolom = 0;

  bolaLabirin = null;

  cssClassMenang = {
    hidden: !this.isGameSelesai
  };

  constructor(
    @Inject(DOCUMENT) private readonly documents: any
  ) {

  }

  ngOnInit(): void {
    // init mesin render engine
    this.initRenderEngine();

    // init tembok pembatas
    this.initPembatasList();

    // Inisialisasi array labirin
    this.initArrayLabirin();

    // Hitung langkah cell berdasarkan baris dan kolom
    this.hitungLangkahCell(this.startBaris, this.startKolom);

    // Buat tembok pembatas
    this.createGarisVertikalHorizontalTembok();

    // Membuat kotak putih untuk Finish labirin
    this.createGoalPoint();

    // Buat bola untuk berjalan di labirin
    this.createBallLabirin();

    this.initListenerKeypress();

    // Kondisi menang jika bola ke arah finish
    this.initListenerStatusMenang();
  }

  ngOnDestroy(): void {
  }

  startTimer() {
    if (this.isStarted === false && this.isGameSelesai === false) {
      this.isStarted = true;
      this.startWaktu = new Date().getTime();
    }
  }

  stopTimer() {
    this.isStarted = false;
    this.stopWaktu = new Date().getTime();

    const totalWaktuMs = this.stopWaktu - this.startWaktu;
    this.totalWaktu = Math.round(totalWaktuMs / 1000);
  }

  initRenderEngine() {
    this.engines = this.Engine.create();
    this.engines.world.gravity.y = 0;
    this.world = this.engines.world;

    this.render = this.Render.create({
      element: this.documents.querySelector('#labiringame'),
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

  initArrayLabirin() {
    // Array 3 x 3 , contohnya :
    // false false false
    // false false false
    // false false false
    // Membuat labirin dengan Array
    // Array vertikal
    this.arrGridKerangka = Array(this.cellVertikal).fill(null);
    // Array horizontal
    this.arrGrid = this.arrGridKerangka.map(() => {
      return Array(this.cellHorizontal).fill(false);
    });

    // Array garis vertikal
    // buat baris dulu, lalu kolom
    this.arrVertikalGrid = Array(this.cellVertikal)
      .fill(null)
      .map(() => {
        return Array(this.cellHorizontal - 1).fill(false);
      });

    // false false
    // false false
    // false false
    // console.log(arrVertikalGrid);

    // false false false
    // false false false
    // Array garis horizontal, buat baris dulu baru kolom
    this.arrHorizontalGrid = Array(this.cellVertikal - 1)
      .fill(null)
      .map(() => {
        // buat kolom
        return Array(this.cellHorizontal).fill(false);
      });
    // console.log(arrHorizontalGrid);

    // Membuat nilai posisi baris dan kolom acak
    this.startBaris = Math.floor(Math.random() * this.cellVertikal);
    this.startKolom = Math.floor(Math.random() * this.cellHorizontal);
  }

  acakDataLabirin(arr: any[][]) {
    const arrayData = arr;
    let counter = arrayData.length;

    while (counter > 0) {
      const indexAcak = Math.floor(Math.random() * counter);
      counter -= 1;

      // Tukar data antar index
      const tempData = arrayData[counter];
      arrayData[counter] = arrayData[indexAcak];
      arrayData[indexAcak] = tempData;
    }

    return arrayData;
  }

  hitungLangkahCell(row: number, column: number) {
    // Jika telah mengunjungi cell dengan koordinat (row, column) maka kembali
    if (this.arrGrid[row][column]) {
      return;
    }

    // Tanda cell ini telah dikunjungi
    this.arrGrid[row][column] = true;

    // Susun daftar random acak dari cell tetangga
    // dimulai searah jarum jam, atas, kanan, bawah, kiri
    const neighboursCoord = [
      [row - 1, column, 'up'],
      [row, column + 1, 'right'],
      [row + 1, column, 'down'],
      [row, column - 1, 'left'],
    ];

    const neighbourCoordAcak = this.acakDataLabirin(neighboursCoord);

    // Untuk setiap cell tetangga
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < neighbourCoordAcak.length; i += 1) {
      const [nextRow, nextColumn, arahDirection] = neighbourCoordAcak[i];

      // Cek apakah tetangga sudah melewati batas atau tidak
      if (
        nextRow < 0 ||
        nextRow >= this.cellVertikal ||
        nextColumn < 0 ||
        nextColumn >= this.cellHorizontal
      ) {
        // tidak jalankan perintah apapun
      } else if (this.arrGrid[nextRow][nextColumn]) {
        // Jika kita telah mengunjungi cell tetangga tersebut lanjutkan dengan mengunjungi tetangga berikutnya
        // tidak jalankan perintah apapun
      } else {
        // Hapus tembok horizontal atau vertikal
        // True artinya menghapus tembok yang ada
        if (arahDirection === 'left') {
          this.arrVertikalGrid[row][column - 1] = true;
        } else if (arahDirection === 'right') {
          this.arrVertikalGrid[row][column] = true;
        } else if (arahDirection === 'up') {
          this.arrHorizontalGrid[row - 1][column] = true;
        } else if (arahDirection === 'down') {
          this.arrHorizontalGrid[row][column] = true;
        }

        this.hitungLangkahCell(nextRow, nextColumn);
      }
    }

    // Kunjungi cell berikutnya
  }

  createGarisVertikalHorizontalTembok() {
    // Gambar kotak secara horizontal
    // Susun garis horizontal untuk pembatas maze labirin
    this.arrHorizontalGrid.forEach((valuerow, rowindex) => {
      // koordinat X = columnIndex x unit length +  unit length / 2
      // koordinat y = rowIndex x unit length + unit length
      valuerow.forEach((openwall: boolean, columnindex: number) => {
        if (openwall === false) {
          const koordX = columnindex * this.unitLengthX + this.unitLengthX / 2;

          const koordY = rowindex * this.unitLengthY + this.unitLengthY;

          const wallTembok = this.Bodies.rectangle(
            koordX,
            koordY,
            this.unitLengthX,
            10,
            {
              isStatic: true,
              label: 'wall',
              render: {
                fillStyle: '#525252'
              }
            }
          );

          this.World.add(this.world, wallTembok);
        }
      });
    });


    // Susun garis vertikal untuk pembatas maze labirin
    this.arrVertikalGrid.forEach((valuerow, rowindex) => {
      valuerow.forEach((openwall: boolean, columnindex: number) => {
        // koordinat x = column index x unit length + unit length
        // koordinat y = rowIndex x unit length + unit length / 2
        if (openwall === false) {
          const koordX = columnindex * this.unitLengthX + this.unitLengthX;
          const koordY = rowindex * this.unitLengthY + this.unitLengthY / 2;

          const wallTembokVertikal = this.Bodies.rectangle(
            koordX,
            koordY,
            10,
            this.unitLengthY,
            {
              isStatic: true,
              label: 'wall',
              render: {
                fillStyle: '#525252',
              },
            },
          );

          this.World.add(this.world, wallTembokVertikal);
        }
      });
    });

  }

  createGoalPoint() {
    // Membuat kotak putih untuk Finish labirin
    // koordX = width x unit length / 2
    // koordY = height x unit length / 2
    const koordX = this.width - this.unitLengthX / 2;
    const koordY = this.height - this.unitLengthY / 2;
    const goals = this.Bodies.rectangle(
      koordX,
      koordY,
      this.unitLengthX * 0.4,
      this.unitLengthY * 0.4,
      {
        isStatic: true,
        render: {
          fillStyle: '#52de97',
        },
        label: 'kotakgoalpoint',
      },
    );

    this.World.add(this.world, goals);
  }

  createBallLabirin() {
    // Buat bola untuk berjalan di labirin
    const koordX = this.unitLengthX / 2;
    const koordY = this.unitLengthY / 2;
    const radius = Math.min(this.unitLengthX, this.unitLengthY) / 4;

    this.bolaLabirin = this.Bodies.circle(koordX, koordY, radius, {
      render: {
        fillStyle: '#ff2e63',
      },
      label: 'bolalabirin',
    });

    this.World.add(this.world, this.bolaLabirin);
  }

  initListenerKeypress() {
    this.documents.addEventListener('keydown', (event: { keyCode: any; }) => {
      const { keyCode } = event;
      const { x: velX, y: velY } = this.bolaLabirin.velocity;

      // console.log(velX, velY);

      if (keyCode === 37 || keyCode === 65) {
        // Gerak ke kiri
        this.startTimer();
        this.Body.setVelocity(this.bolaLabirin, { x: velX - 5, y: velY });
      } else if (keyCode === 38 || keyCode === 87) {
        // Gerak ke atas
        this.startTimer();
        this.Body.setVelocity(this.bolaLabirin, { x: velX, y: velY - 5 });
      } else if (keyCode === 39 || keyCode === 68) {
        // Gerak ke kanan
        this.startTimer();
        this.Body.setVelocity(this.bolaLabirin, { x: velX + 5, y: velY });
      } else if (keyCode === 40 || keyCode === 83) {
        // Gerak ke bawah
        this.startTimer();
        this.Body.setVelocity(this.bolaLabirin, { x: velX, y: velY + 5 });
      } else {
        // Keycode tidak ada untuk gerak tombol arah
        console.log('Keycode salah langkah');
      }
    });
  }

  initListenerStatusMenang() {
    // Kondisi menang jika bola ke arah finish
    this.Events.on(this.engines, 'collisionStart', event => {
      const pairColl = event.pairs;
      const labels = ['kotakgoalpoint', 'bolalabirin'];

      pairColl.forEach((collision: { bodyA: { label: string; }; bodyB: { label: string; }; }) => {
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          this.cekStatusMenang();
          this.world.gravity.y = 1;
          this.world.bodies.forEach((bodys: Matter.Body) => {
            if (bodys.label === 'wall') {
              this.Body.setStatic(bodys, false);
            }
          });
        }
      });
    });

  }

  cekStatusMenang() {
    if (this.isGameSelesai === false) {
      this.isGameSelesai = true;

      this.stopTimer();

      const winnerEl = this.documents.querySelector('.kontainer');
      winnerEl.classList.remove('hidden');

      const pElementKeterangan = this.documents.createElement('p');
      pElementKeterangan.innerText = `Selamat anda telah menang! Waktu anda adalah ${this.totalWaktu} detik.`;

      const menangEl = this.documents.querySelector('.kotakmenang');
      menangEl.innerHTML = '';
      menangEl.appendChild(pElementKeterangan);

      winnerEl.style.position = 'absolute';
    }
  }
}
