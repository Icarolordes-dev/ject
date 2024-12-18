import React, { useState, useEffect, useRef } from 'react';
import gsap from "gsap";
import * as zdog from "zdog";

const { Illustration, TAU, Shape, Group, Ellipse } = zdog;

const AXIS_LENGTH = Math.max(300, window.innerWidth * 0.25);
const PIPE_LIFESPAN = 2000;
const PIPE_SPEED = 0.00999;
const PIPE_STROKE = 5;
const TEAPOT_PROBABILITY = 0.99;
const PIPE_COLORS = [
  "#f4d928",
  "#f4d928",
  "#f4d928",
  "#f4d928",
  "#f4d928"
];

let CURRENT_PIPE = undefined;
const PIPES = [];

class Pipe {
  constructor(opts) {
    this.IS_ALIVE = true;
    this.ACTIVE_AXIS = undefined;
    this.LENGTH = 0;
    this.SHAPES = [];
    this.SHAPE = new Shape({
      addTo: Scene,
      stroke: PIPE_STROKE,
      closed: false,
      color: opts.color,
      path: opts.path
    });
    this.SHAPES.push(this.SHAPE);
    this.SHAPES.push(
      new Shape({
        addTo: Scene,
        stroke: PIPE_STROKE * 2,
        translate: opts.path[0],
        color: opts.color
      })
    );
    this.start();
  }

  start() {
    const availableAxes = ["x", "y", "z"].filter((v) => v !== this.ACTIVE_AXIS);
    this.ACTIVE_AXIS = this.ACTIVE_AXIS
      ? availableAxes[Math.floor(Math.random() * 2)]
      : availableAxes[Math.floor(Math.random() * 3)];

    this.SHAPE.path = [
      ...this.SHAPE.path,
      { ...this.SHAPE.path[this.SHAPE.path.length - 1] }
    ];

    const currentPos = this.SHAPE.path[this.SHAPE.path.length - 1][
      this.ACTIVE_AXIS
    ];
    const newPos = gsap.utils.random(-AXIS_LENGTH / 2, AXIS_LENGTH / 2);
    const distance = Math.abs(newPos - currentPos);
    this.LENGTH += distance;
    const duration = distance * PIPE_SPEED;

    this.__ANIMATION = gsap.to(this.SHAPE.path[this.SHAPE.path.length - 1], {
      [this.ACTIVE_AXIS]: newPos,
      duration,
      ease: "none",
      onComplete: () => {
        if (Math.random() > TEAPOT_PROBABILITY) {
          this.SHAPES.push(
            Teapot.copyGraph({
              addTo: Scene,
              translate: this.SHAPE.path[this.SHAPE.path.length - 1],
              children: [...Teapot.children.map((c) => (c.color = this.SHAPE.color))]
            })
          );
        } else {
          this.SHAPES.push(
            new Shape({
              addTo: Scene,
              stroke: PIPE_STROKE * 2,
              color: this.SHAPE.color,
              translate: this.SHAPE.path[this.SHAPE.path.length - 1]
            })
          );
        }
        if (this.LENGTH > PIPE_LIFESPAN) {
          this.IS_ALIVE = false;
        } else {
          this.start();
        }
      }
    });
  }
}

const Teapot = new Group();
new Shape({
  stroke: 15,
  addTo: Teapot,
  color: "green"
});
new Ellipse({
  addTo: Teapot,
  color: "blue",
  diameter: 8,
  stroke: 2,
  translate: { x: -7 }
});
new Shape({
  stroke: 4,
  addTo: Teapot,
  color: "purple",
  translate: { y: -10 }
});

let Scene;

function App() {
  const canvasRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    Scene = new Illustration({
      element: canvasRef.current,
      resize: "fullscreen",
      dragRotate: true,
      rotate: {
        x: TAU * -0.075,
        y: 0
      }
    });

    const draw = () => {
      if (!CURRENT_PIPE || !CURRENT_PIPE.IS_ALIVE) {
        CURRENT_PIPE = new Pipe({
          color: PIPE_COLORS[Math.floor(Math.random() * PIPE_COLORS.length)],
          path: [
            {
              x: gsap.utils.random(-AXIS_LENGTH / 2, AXIS_LENGTH / 2),
              y: gsap.utils.random(-AXIS_LENGTH / 2, AXIS_LENGTH / 2),
              z: gsap.utils.random(-AXIS_LENGTH / 2, AXIS_LENGTH / 2)
            }
          ]
        });
        PIPES.push(CURRENT_PIPE);
      }

      if (CURRENT_PIPE?.IS_ALIVE) {
        CURRENT_PIPE.SHAPE.updatePathCommands();
      }

      Scene.updateRenderGraph();
    };

    gsap.to(Scene.rotate, {
      y: TAU,
      ease: "none",
      duration: 30,
      repeat: -1
    });

    gsap.ticker.add(draw);

    const RESET = () => {
      PIPES.forEach((child) => {
        child["__ANIMATION"]?.kill();
        child["SHAPES"].forEach((shape) => shape.remove());
      });
      CURRENT_PIPE = undefined;
    };

    window.addEventListener("dblclick", RESET);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("dblclick", RESET);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'bg-backgroundNight text-textPrimaryNight' : 'bg-backgroundDay text-textPrimaryDay'} min-h-screen`}>
      <header className="bg-primary1 text-backgroundNight p-4 text-center">
        <h1 className="text-2xl font-bold">GP Gomes Fogões</h1>
        <p>Excelência em Soluções de Gás</p>
      </header>
      <nav className="bg-gray-100 p-4">
        <div className="container mx-auto flex justify-center">
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-primary2">Início</a></li>
            <li><a href="/produtos" className="hover:text-primary2">Produtos</a></li>
            <li><a href="/servicos" className="hover:text-primary2">Serviços</a></li>
            <li><a href="/contato" className="hover:text-primary2">Contato</a></li>
            <li><a href="/sobre" className="hover:text-primary2">Sobre</a></li>
          </ul>
        </div>
      </nav>
      <main className="container mx-auto py-8 flex">
        <div className="w-1/2 pr-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Soluções Completas em Gás</h2>
            <p className="mb-4">Qualidade, segurança e experiência de mais de 20 anos em soluções para sua casa ou negócio.</p>
            <div className="flex space-x-4">
              <button className="bg-primary2 text-white py-2 px-4 rounded hover:bg-primary1">Fale com um Especialista</button>
              <button className="bg-primary2 text-white py-2 px-4 rounded hover:bg-primary1">Seu Orçamento Gratuito</button>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Com Você do Início ao Fim!</h2>
            <p className="mb-4">Um processo transparente e seguro em cada etapa do seu projeto.</p>
            <ul className="list-disc pl-5">
              <li>Consulta Inicial: Nossa equipe ouve suas necessidades e oferece soluções personalizadas.</li>
              <li>Orçamento Detalhado: Receba um orçamento claro e competitivo em até 72h.</li>
              <li>Instalação Profissional: Garantimos uma instalação segura e eficiente com nossos técnicos certificados.</li>
              <li>Suporte Contínuo: Manutenção e suporte para que seus equipamentos funcionem sempre no máximo desempenho.</li>
            </ul>
          </section>
        </div>
        <div className="w-1/2">
          <canvas ref={canvasRef} className="touch-none h-screen w-full"></canvas>
        </div>
      </main>
      <footer className="bg-gray-100 p-4 text-center">
        <p>FAQ</p>
        <p>RODAPE SIMPLES</p>
      </footer>
      <button onClick={toggleDarkMode} className="fixed bottom-4 right-4 bg-gray-300 p-2 rounded">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}

export default App;
