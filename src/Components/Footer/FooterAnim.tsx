import React, { useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Mouse, MouseConstraint, World, Events, Composite } from 'matter-js';
import FooterPhrase from './FooterPhrase';
import { randomNumber } from '@/src/utils/randomNumber';

const phrases = [
  'Charlas',
  'Conferencias',
  'Talleres',
  'Master Clases',
  'Cursos',
  'Seminarios',
  'Congresos'
];

// eslint-disable-next-line max-lines-per-function
const FooterAnim = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {

    if (!hasLoaded) { return }

    const sceneWidth = sceneRef.current?.clientWidth ?? 0;
    const sceneHeight = sceneRef.current?.clientHeight ?? 0;

    const engine = Engine.create();
    const { world } = engine;

    const render = Render.create({
      element: sceneRef.current ?? undefined,
      engine: engine,
      options: {
        width: sceneWidth,
        height: sceneHeight,
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
        background: '#fff',
      }
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const boxes = phrases.map((phrase) => {
      const object = document.getElementById(`box-${phrase}`);
      const objectRect = object?.getBoundingClientRect();
      const rectangle = Bodies.rectangle(objectRect?.x ?? 0, 0, objectRect?.width ?? 0, objectRect?.height ?? 0, {
        label: `box-${phrase}`,
        render: {
          fillStyle: 'transparent',
        },
      });
      const angle = randomNumber(-20, 20);
      Matter.Body.setAngle(rectangle, angle);
      return rectangle;
    });

    const limits = [
      Bodies.rectangle(sceneWidth / 2, -200, sceneWidth, 200, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(sceneWidth / 2, sceneHeight + 100, sceneWidth * 2, 200, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(sceneWidth + 100, sceneHeight / 2, 200, sceneHeight * 2, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(-100, sceneHeight / 2, 200, sceneHeight, { isStatic: true, render: { fillStyle: 'transparent' } })
    ];

    World.add(world, [...boxes, ...limits]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(world, mouseConstraint);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);

    Events.on(engine, 'beforeUpdate', function () {
      Composite.allBodies(world).forEach(function (body) {
        if (body.isStatic) { return }
        const boxRender = document.getElementById(body.label);
        if (boxRender) {
          const boxWidth = boxRender.clientWidth;
          const boxHeight = boxRender.clientHeight;
          boxRender.style.position = 'absolute';
          boxRender.style.left = `${body.position.x - (boxWidth / 2)}px`;
          boxRender.style.top = `${body.position.y - (boxHeight / 2)}px`;
          boxRender.style.transform = `rotate(${body.angle}rad)`;
          return;
        }
      });
    });

  }, [hasLoaded]);

  useEffect(() => {
    const onScroll = () => {
      const footerAnim = document.getElementById('footer-anim');
      if (!footerAnim) { return }
      const rect = footerAnim.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5 && !hasLoaded) {
        setHasLoaded(true);
      }
    };
    document.addEventListener('scroll', onScroll);
    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className='w-full flex items-center justify-center relative' id='footer-anim'>
      <div className='absolute top-1/2 -translate-y-1/2 bg-pale-skin w-full h-[300px]'></div>
      <div ref={sceneRef} className='w-[90%] sm:w-[80%] h-[500px] my-2 relative overflow-hidden bg-white rounded-[10px]'>
        <div className='flex flex-wrap absolute w-full h-full pointer-events-none justify-end'>
          {
            phrases.map((phrase, i) => (
              <FooterPhrase key={`footer-Phrase-${phrase}-${i}`} label={phrase} id={`box-${phrase}`} />
            ))
          }
        </div>
        <p className='text-black absolute top-[100px] sm:top-1/2 sm:-translate-y-1/2 left-[50px] sm:left-[100px] z-50 leading-none sm:leading-[50px] text-[30px] sm:text-[70px] font-stretch-pro'>Servimos <br /> a través</p>
      </div>
    </div>
  );
};

export default FooterAnim;