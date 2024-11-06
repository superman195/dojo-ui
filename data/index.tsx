import CreateTaskAnimation from '@/components/HomePageComponents/CreateTaskAnimation';
import DistributeSubscriptionKeyAnimation from '@/components/HomePageComponents/DistributeSubscriptionKeyAnimation';
import EarnStepAnimation from '@/components/HomePageComponents/EarnStepAnimation';
import { StepCardProps } from '@/components/HomePageComponents/StepCard';
import Image from 'next/image';

interface HeaderItem {
  title: string;
  url: string;
}
export const exampleInteractiveData = {
  combined_html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newton's Cradle Visualization</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #f0f0f0;
        }
        #canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
        #chaosButton {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 8px 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 10;
        }
        #instructions {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            color: #333;
            font-family: Arial, sans-serif;
            font-size: 12px;
            text-align: center;
            z-index: 10;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <button id="chaosButton">Toggle Chaos Mode</button>
    <div id="instructions">Click and drag a ball to interact. Hover over a ball to turn it red. Toggle Chaos Mode for unpredictable behavior.</div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
    <script>
    (function() {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Constraint = Matter.Constraint,
            Bodies = Matter.Bodies,
            Events = Matter.Events,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create(),
            world = engine.world;

        const canvas = document.getElementById('canvas');
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        const render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: '#f0f0f0'
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        function createNewtonsCradle() {
            const cradle = Composite.create();
            const minDimension = Math.min(width, height);
            const ballRadius = minDimension * (width < 480 ? 0.08 : 0.05);
            const ballGap = ballRadius * 0.25;
            const numBalls = width < 480 ? 3 : 5;
            const startX = width / 2 - ((numBalls - 1) * (ballRadius * 2 + ballGap)) / 2;
            const startY = height / 2;

            const balls = [];
            const constraints = [];

            for (let i = 0; i < numBalls; i++) {
                const ball = Bodies.circle(
                    startX + i * (ballRadius * 2 + ballGap),
                    startY + ballRadius * 3,
                    ballRadius,
                    {
                        inertia: Infinity,
                        restitution: 1,
                        friction: 0,
                        frictionAir: 0.0001,
                        slop: 1,
                        render: { fillStyle: '#c0c0c0' }
                    }
                );
                balls.push(ball);

                const constraint = Constraint.create({
                    pointA: { x: startX + i * (ballRadius * 2 + ballGap), y: startY - ballRadius * 3 },
                    bodyB: ball,
                    length: ballRadius * 6,
                    stiffness: 1,
                    render: { strokeStyle: '#222', lineWidth: 2 }
                });
                constraints.push(constraint);
            }

            Composite.add(cradle, [...balls, ...constraints]);
            return { cradle, balls };
        }

        let { cradle, balls } = createNewtonsCradle();
        Composite.add(world, cradle);

        const support = Bodies.rectangle(width / 2, height / 2 - balls[0].circleRadius * 3, width / 2, 10, {
            isStatic: true,
            render: { fillStyle: '#333' }
        });
        Composite.add(world, support);

        // Mouse control
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

        Composite.add(world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        let chaosMode = false;
        const chaosButton = document.getElementById('chaosButton');
        chaosButton.addEventListener('click', () => {
            chaosMode = !chaosMode;
            chaosButton.textContent = chaosMode ? 'Disable Chaos' : 'Enable Chaos';
        });

        Events.on(engine, 'afterUpdate', () => {
            balls.forEach((ball) => {
                if (chaosMode && Math.random() < 0.01) {
                    Body.applyForce(ball, ball.position, {
                        x: (Math.random() - 0.5) * 0.002,
                        y: (Math.random() - 0.5) * 0.002
                    });
                }
            });
        });

        function resizeCanvas() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            render.canvas.width = width;
            render.canvas.height = height;
            render.options.width = width;
            render.options.height = height;
            Matter.Render.setPixelRatio(render, window.devicePixelRatio);

            Composite.clear(world, false);
            let newCradle = createNewtonsCradle();
            Composite.add(world, [newCradle.cradle, support, mouseConstraint]);
            balls = newCradle.balls;
            Body.setPosition(support, { x: width / 2, y: height / 2 - balls[0].circleRadius * 3 });
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Add hover effect
        Events.on(render, 'afterRender', function() {
            const hoveredBall = Matter.Query.point(balls, mouse.position)[0];
            balls.forEach(ball => {
                if (ball === hoveredBall) {
                    ball.render.fillStyle = '#ff0000'; // Red color on hover
                } else {
                    ball.render.fillStyle = '#c0c0c0'; // Default color
                }
            });
        });
    })();
    </script>
</body>
</html>`,
};
export const keySliderInteractiveData = {
  combined_html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newton's Cradle Visualization</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        #canvas {
            display: block;
            width: 100%;
            height: 100%;
            touch-action: none;
        }
        #chaosButton {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 10;
            transition: background-color 0.3s;
        }
        #chaosButton:hover {
            background-color: #45a049;
        }
        #instructions {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            color: #333;
            font-size: 12px;
            text-align: center;
            z-index: 10;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 5px;
            border-radius: 5px;
        }
        @media (max-width: 600px) {
            #chaosButton {
                top: 5px;
                left: 5px;
                padding: 8px 12px;
                font-size: 12px;
            }
            #instructions {
                font-size: 10px;
                bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <button id="chaosButton">Toggle Chaos Mode</button>
    <div id="instructions">Tap and drag a ball to interact. Toggle Chaos Mode for unpredictable behavior.</div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
    <script>
    (function() {
        // Newton's Cradle Visualization
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Constraint = Matter.Constraint,
            Bodies = Matter.Bodies,
            Events = Matter.Events,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create(),
            world = engine.world;

        const canvas = document.getElementById('canvas');
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        const render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: '#f0f0f0'
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Create Newton's Cradle
        function createNewtonsCradle() {
            const cradle = Composite.create();
            const ballRadius = Math.min(width, height) * (width < 600 ? 0.05 : 0.03);
            const ballGap = 5;
            const numBalls = width < 600 ? 3 : 5;
            const startX = width / 2 - ((numBalls - 1) * (ballRadius * 2 + ballGap)) / 2;
            const startY = height / 2;

            const balls = [];
            const constraints = [];

            for (let i = 0; i < numBalls; i++) {
                const ball = Bodies.circle(
                    startX + i * (ballRadius * 2 + ballGap),
                    startY + ballRadius * 5,
                    ballRadius,
                    {
                        inertia: Infinity,
                        restitution: 1,
                        friction: 0,
                        frictionAir: 0.0001,
                        slop: 1,
                        render: {
                            fillStyle: '#c0c0c0'
                        }
                    }
                );
                balls.push(ball);

                const constraint = Constraint.create({
                    pointA: { x: startX + i * (ballRadius * 2 + ballGap), y: startY - ballRadius * 5 },
                    bodyB: ball,
                    length: ballRadius * 10,
                    stiffness: 1,
                    render: {
                        strokeStyle: '#222'
                    }
                });
                constraints.push(constraint);
            }

            Composite.add(cradle, [...balls, ...constraints]);
            return { cradle, balls };
        }

        let { cradle, balls } = createNewtonsCradle();
        Composite.add(world, cradle);

        // Add horizontal support
        const support = Bodies.rectangle(width / 2, height / 2 - balls[0].circleRadius * 5, width / 2, 10, {
            isStatic: true,
            render: {
                fillStyle: '#333'
            }
        });
        Composite.add(world, support);

        // Mouse control
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
        Composite.add(world, mouseConstraint);

        // Chaos mode
        let chaosMode = false;
        const chaosButton = document.getElementById('chaosButton');
        chaosButton.addEventListener('click', () => {
            chaosMode = !chaosMode;
            chaosButton.textContent = chaosMode ? 'Disable Chaos' : 'Enable Chaos';
            // Send message to parent
            window.parent.postMessage({ type: 'chaosMode', value: chaosMode }, '*');
        });
        // Automatically trigger chaos mode
        setTimeout(() => {
            chaosMode = true;
            chaosButton.textContent = 'Disable Chaos';
            window.parent.postMessage({ type: 'chaosMode', value: true }, '*');
        }, 0); 


        // Color changing and energy calculation
        Events.on(engine, 'afterUpdate', () => {
            let totalKineticEnergy = 0;
            balls.forEach((ball, index) => {
                const velocity = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
                const maxVelocity = 5;
                const normalizedVelocity = Math.min(velocity / maxVelocity, 1);
                const color = interpolateColor('#c0c0c0', '#ff0000', normalizedVelocity);
                ball.render.fillStyle = color;

                // Calculate kinetic energy
                totalKineticEnergy += 0.5 * ball.mass * velocity ** 2;

                // Chaos mode
                if (chaosMode && Math.random() < 0.01) {
                    Body.applyForce(ball, ball.position, {
                        x: (Math.random() - 0.5) * 0.001,
                        y: (Math.random() - 0.5) * 0.001
                    });
                }
            });

            // Send kinetic energy to parent
            window.parent.postMessage({ type: 'kineticEnergy', value: Math.round(totalKineticEnergy) }, '*');
        });

        // Helper function to interpolate colors
        function interpolateColor(color1, color2, factor) {
            const r1 = parseInt(color1.substr(1, 2), 16);
            const g1 = parseInt(color1.substr(3, 2), 16);
            const b1 = parseInt(color1.substr(5, 2), 16);

            const r2 = parseInt(color2.substr(1, 2), 16);
            const g2 = parseInt(color2.substr(3, 2), 16);
            const b2 = parseInt(color2.substr(5, 2), 16);

            const r = Math.round(r1 + factor * (r2 - r1));
            const g = Math.round(g1 + factor * (g2 - g1));
            const b = Math.round(b1 + factor * (b2 - b1));

            return \`rgb(\${r}, \${g}, \${b})\`;
        }

        // Resize canvas on window resize
        function resizeCanvas() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            render.canvas.width = width;
            render.canvas.height = height;
            render.options.width = width;
            render.options.height = height;
            Render.setPixelRatio(render, window.devicePixelRatio);

            // Recreate the Newton's Cradle
            Composite.clear(world, false);
            let newCradle = createNewtonsCradle();
            Composite.add(world, [newCradle.cradle, support, mouseConstraint]);
            balls = newCradle.balls;

            // Update support position
            Body.setPosition(support, { x: width / 2, y: height / 2 - balls[0].circleRadius * 5 });
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial call to set up the canvas correctly

        // Clean up function
        window.addEventListener('message', (event) => {
            if (event.data === 'cleanup') {
                window.removeEventListener('resize', resizeCanvas);
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
            }
        });

        // Change cursor on ball hover
        Events.on(render, 'afterRender', function() {
            const hoveredBall = Matter.Query.point(balls, mouse.position)[0];
            if (hoveredBall) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        });
    })();
    </script>
</body>
</html>`,
};

// ... rest of the code ...
export const steps: StepCardProps[] = [
  {
    stepNumber: 1,
    title: 'Creating an account',
    description: 'Connect metamask wallet',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/wallet-step-v2.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
          className="rounded-tl-xl border-2 border-solid border-black shadow-brut-sm"
        />
      </div>
    ),
  },
  {
    stepNumber: 2,
    title: 'Input subscription keys',
    description: 'Obtain subscription key from miners and save it',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/subscription_key_step.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
          className="rounded-tl-xl border-2 border-solid border-black shadow-brut-sm"
        />
      </div>
    ),
  },
  {
    stepNumber: 3,
    title: 'Start contributing',
    description: 'Start working on available tasks',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/contribute-task.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
        />
      </div>
    ),
  },
  {
    stepNumber: 4,
    title: 'Get rewarded',
    description: 'Get paid for your contribution to open source AI',
    imageComponent: <EarnStepAnimation />,
  },
];
export const minerSteps = [
  {
    stepNumber: 1,
    height: 150,
    title: 'Set up your miner',
    description:
      'Visit <a href="https://github.com/tensorplex-labs/dojo" target="_blank" style="text-decoration: underline; hover:color: #1e40af; hover:text-decoration: none; font-weight: 700;" className="">Dojo GitHub</a> to set up the Dojo Subnet Miner',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/miner-step-1.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
          className="rounded-tl-xl border-2 border-solid border-black shadow-brut-sm"
        />
      </div>
    ),
  },
  {
    stepNumber: 2,
    height: 150,
    title: 'Wallet authentication',
    description: 'After setting up your miner, authenticate using CLI',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/miner-step-2.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
          className="rounded-tl-xl border-2 border-solid border-black shadow-brut-sm"
        />
      </div>
    ),
  },
  {
    stepNumber: 3,
    height: 150,
    title: 'Generate keys',
    description: 'Generate API and subscription keys using CLI',
    imageComponent: (
      <div className=" relative -right-2  aspect-[2] overflow-hidden border-black pl-4">
        <Image
          src={'/miner-step-3.png'}
          alt="Image of Tensorplex Dojo Wallet Connection user interface"
          width={1520}
          height={620}
          className="rounded-tl-xl border-2 border-solid border-black shadow-brut-sm"
        />
      </div>
    ),
  },
  {
    stepNumber: 4,
    title: 'Start the miner and create new tasks',
    description:
      'Start the miner through the instructions <a href="https://github.com/tensorplex-labs/dojo?tab=readme-ov-file#mining" target="_blank" style="text-decoration: underline; hover:color: #1e40af; hover:text-decoration: none; font-weight: 700;" className="">here</a>',
    imageComponent: <CreateTaskAnimation />,
  },
  {
    stepNumber: 5,
    title: 'Distribute subscription keys',
    description: 'Issue out subscription keys to participants for contribution!',
    imageComponent: <DistributeSubscriptionKeyAnimation />,
  },
];

export const headerItems: Array<HeaderItem> = [
  {
    title: 'Task List',
    url: '/task-list',
  },
  {
    title: 'FAQ',
    url: '/faq',
  },
  {
    title: 'Docs',
    url: 'https://tensorplex.gitbook.io/tensorplex-docs/',
  },
];
export const dropdownOptions = [
  { text: 'Most Attempted', value: 'numResults' },
  { text: 'Most Recent', value: 'createdAt' },
  { text: 'Least Difficult', value: 'numCriteria' },
];
export interface FrequentlyAccessedProps {
  title: string;
  description: string;
  isLong: boolean;
  type: string;
  route: string;
  isRoutable?: boolean;
  onClickHandler?: (text: string) => void;
  delayBy?: number;
}
export const TensorplexProducts: FrequentlyAccessedProps[] = [
  {
    title: 'Tensorplex Stake',
    description:
      'Deposit wTAO on Ethereum and receive stTAO which represents your share of TAO staked on the Bittensor Finney Network',
    isLong: true,
    isRoutable: true,
    type: 'product',
    route: 'https://stake.tensorplex.ai/',
  },
  {
    title: 'Tensorplex Stream',
    description: 'Discover insights from key opinion leaders in Web3 with content curated from the Tensorplex Team',
    isLong: true,
    type: 'product',
    isRoutable: true,
    route: 'https://stream.tensorplex.ai/',
  },
  {
    title: 'Tensorplex Dojo',
    description:
      'Dojo is a decentralized platform that leverages the collective power of human insights to train AI models.',
    isLong: true,
    type: 'product',
    isRoutable: true,
    route: '/',
  },
];

export const frequentlyAccessedData: FrequentlyAccessedProps[] = [
  {
    title: 'Tensorplex AI Chatbot',
    description: 'Ask anything and everything about Web3',
    isLong: false,
    type: 'page',
    route: 'https://stream.tensorplex.ai/TensorplexAIChatbot',
  },
  {
    title: 'Podcasts',
    description: 'Access to our curated list of more than 1900 podcasts',
    isLong: false,
    type: 'page',
    route: 'https://stream.tensorplex.ai',
  },
];

const faqListBase = [
  {
    id: '1',
    content: `
    <ol style="list-style-type: decimal" class="pl-5">
    <li style="margin-bottom: 10px"><strong>I want to get rewarded by completing tasks</strong>: <a href="https://docs.tensorplex.ai/tensorplex-docs/tensorplex-dojo-subnet-testnet/guide-contributor" target="_blank" style="color: #2563eb; text-decoration: underline; hover:color: #1e40af; hover:text-decoration: none;">Getting started</a>.</li>
      <li style="margin-bottom: 10px"><strong>I&apos;m a Miner</strong>: <a href="https://docs.tensorplex.ai/tensorplex-docs/tensorplex-dojo-subnet-testnet/guide-miner" target="_blank" style="color: #2563eb; text-decoration: underline; hover:color: #1e40af; hover:text-decoration: none;">Setup Guide</a>.</li>
      <li><strong>I&apos;m a validator</strong>: <a href="https://docs.tensorplex.ai/tensorplex-docs/tensorplex-dojo-subnet-testnet/guide-validator" target="_blank" style="color: #2563eb; text-decoration: underline; hover:color: #1e40af; hover:text-decoration: none;">Setup Guide</a>.</li>
      </ol>
      `,
    title: 'How do I get started?',
  },
  {
    id: '2',
    content:
      'Dojo is a decentralized platform that leverages the collective power of human insights to train AI models. By contributing to data labeling across various domains, users earn TAO tokens, enhancing AI learning and earning rewards in the process.',
    title: 'What is Dojo?',
  },
  {
    id: '3',
    content:
      'Rewards are distributed from the emissions generated by the Bittensor network. These emissions are allocated to Subnet miners, like those in Dojo, who contribute to the enhancement of machine learning models through high-quality data provision.',
    title: 'Where do the rewards come from?',
  },
  {
    id: '4',
    content:
      'Assessment times can vary depending on the complexity of the task and the current network activity. Generally, assessments are completed within 24 to 48 hours after submission.',
    title: 'How long does it take for the assessment to be completed?',
  },
  {
    id: '5',
    content:
      'The data collected and labelled by our contributors will be open sourced and used to train and improve machine learning models. This data helps in making open-source AI smarter, more accurate, and capable of understanding and performing tasks in a wide range of real-world applications.',
    title: 'What is the use of the data?',
  },
  {
    id: '6',
    content:
      'Some tasks are designed to validate the quality and reliability of contributions and may not offer direct rewards. These tasks are crucial for maintaining the integrity of the data and ensuring that high standards are met across the platform.',
    title: 'Why do some tasks have no rewards?',
  },
  {
    id: '7',
    content:
      'If you are unsure or not confident in responding to some of these tasks, you can choose to skip it and move on to another task better suited to your skills and knowledge. Do note that if you skip too many tasks your miner will eventually be deregistered from the network.',
    title: 'What happens if I am not confident in answering some of the tasks?',
  },
  {
    id: '8',
    content:
      'Currently, Dojo does not have a mobile app, but we are actively developing one. Stay tuned for updates and get ready to contribute on-the-go!',
    title: 'Is there a mobile app?',
  },
];

export const faqList = faqListBase.map((faq, idx) => {
  return {
    ...faq,
    id: idx + 1,
  };
});

export const categories = [
  { label: 'Code Generation', isActive: false, taskType: 'CODE_GENERATION' },
  { label: 'Text To Image', isActive: false, taskType: 'TEXT_TO_IMAGE' },
  { label: 'Dialogue', isActive: false, taskType: 'DIALOGUE' },
  { label: '3D Model', isActive: false, taskType: 'TEXT_TO_THREE_D' },
];

export const questionMultiSelectData = [
  {
    id: 1,
    htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Static HTML file</title>
          <style>
            html, body {
              box-sizing: border-box;
              display: flow-root;
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
          <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-3.4.1.min.js"></script>
          <script type="text/javascript">
              Bokeh.set_log_level("info");
          </script>
        </head>
        <body>
          <div id="b6a91bc0-10db-4e1a-a996-e08596853fce" data-root-id="p1001" style="display: contents;"></div>

          <script type="application/json" id="b8c9ab1f-d406-438e-9d5f-32ed50e804a9">
            {"a27876f0-ca97-4031-b871-4addcdc76156":{"version":"3.4.1","title":"Bokeh Application","roots":[{"type":"object","name":"Figure","id":"p1001","attributes":{"height":250,"max_width":500,"sizing_mode":"stretch_width","x_range":{"type":"object","name":"DataRange1d","id":"p1002"},"y_range":{"type":"object","name":"DataRange1d","id":"p1003"},"x_scale":{"type":"object","name":"LinearScale","id":"p1010"},"y_scale":{"type":"object","name":"LinearScale","id":"p1011"},"title":{"type":"object","name":"Title","id":"p1008"},"renderers":[{"type":"object","name":"GlyphRenderer","id":"p1039","attributes":{"data_source":{"type":"object","name":"ColumnDataSource","id":"p1033","attributes":{"selected":{"type":"object","name":"Selection","id":"p1034","attributes":{"indices":[],"line_indices":[]}},"selection_policy":{"type":"object","name":"UnionRenderers","id":"p1035"},"data":{"type":"map","entries":[["x",[1,2,3,4,5]],["y",[4,5,5,7,2]]]}}},"view":{"type":"object","name":"CDSView","id":"p1040","attributes":{"filter":{"type":"object","name":"AllIndices","id":"p1041"}}},"glyph":{"type":"object","name":"Scatter","id":"p1036","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"fill_color":{"type":"value","value":"red"}}},"nonselection_glyph":{"type":"object","name":"Scatter","id":"p1037","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.1},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.1},"hatch_alpha":{"type":"value","value":0.1}}},"muted_glyph":{"type":"object","name":"Scatter","id":"p1038","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.2},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.2},"hatch_alpha":{"type":"value","value":0.2}}}}}],"toolbar":{"type":"object","name":"Toolbar","id":"p1009","attributes":{"tools":[{"type":"object","name":"PanTool","id":"p1022"},{"type":"object","name":"WheelZoomTool","id":"p1023","attributes":{"renderers":"auto"}},{"type":"object","name":"BoxZoomTool","id":"p1024","attributes":{"overlay":{"type":"object","name":"BoxAnnotation","id":"p1025","attributes":{"syncable":false,"level":"overlay","visible":false,"left":{"type":"number","value":"nan"},"right":{"type":"number","value":"nan"},"top":{"type":"number","value":"nan"},"bottom":{"type":"number","value":"nan"},"left_units":"canvas","right_units":"canvas","top_units":"canvas","bottom_units":"canvas","line_color":"black","line_alpha":1.0,"line_width":2,"line_dash":[4,4],"fill_color":"lightgrey","fill_alpha":0.5}}}},{"type":"object","name":"SaveTool","id":"p1030"},{"type":"object","name":"ResetTool","id":"p1031"},{"type":"object","name":"HelpTool","id":"p1032"}]}},"left":[{"type":"object","name":"LinearAxis","id":"p1017","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1018","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1019"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1020"}}}],"below":[{"type":"object","name":"LinearAxis","id":"p1012","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1013","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1014"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1015"}}}],"center":[{"type":"object","name":"Grid","id":"p1016","attributes":{"axis":{"id":"p1012"}}},{"type":"object","name":"Grid","id":"p1021","attributes":{"dimension":1,"axis":{"id":"p1017"}}}]}}]}}
          </script>
          <script type="text/javascript">
            (function() {
              const fn = function() {
                Bokeh.safely(function() {
                  (function(root) {
                    function embed_document(root) {
                    const docs_json = document.getElementById('b8c9ab1f-d406-438e-9d5f-32ed50e804a9').textContent;
                    const render_items = [{"docid":"a27876f0-ca97-4031-b871-4addcdc76156","roots":{"p1001":"b6a91bc0-10db-4e1a-a996-e08596853fce"},"root_ids":["p1001"]}];
                    root.Bokeh.embed.embed_items(docs_json, render_items);
                    }
                    if (root.Bokeh !== undefined) {
                      embed_document(root);
                    } else {
                      let attempts = 0;
                      const timer = setInterval(function(root) {
                        if (root.Bokeh !== undefined) {
                          clearInterval(timer);
                          embed_document(root);
                        } else {
                          attempts++;
                          if (attempts > 100) {
                            clearInterval(timer);
                            console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                          }
                        }
                      }, 10, root)
                    }
                  })(window);
                });
              };
              if (document.readyState != "loading") fn();
              else document.addEventListener("DOMContentLoaded", fn);
            })();
          </script>
        </body>
      </html>`,
    title: 'Caption for Bokeh Plot 1',
    showTitle: true,
  },
  {
    id: 2,
    htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Static HTML file</title>
          <style>
            html, body {
              box-sizing: border-box;
              display: flow-root;
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
          <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-3.4.1.min.js"></script>
          <script type="text/javascript">
              Bokeh.set_log_level("info");
          </script>
        </head>
        <body>
          <div id="b6a91bc0-10db-4e1a-a996-e08596853fce" data-root-id="p1001" style="display: contents;"></div>

          <script type="application/json" id="b8c9ab1f-d406-438e-9d5f-32ed50e804a9">
            {"a27876f0-ca97-4031-b871-4addcdc76156":{"version":"3.4.1","title":"Bokeh Application","roots":[{"type":"object","name":"Figure","id":"p1001","attributes":{"height":250,"max_width":500,"sizing_mode":"stretch_width","x_range":{"type":"object","name":"DataRange1d","id":"p1002"},"y_range":{"type":"object","name":"DataRange1d","id":"p1003"},"x_scale":{"type":"object","name":"LinearScale","id":"p1010"},"y_scale":{"type":"object","name":"LinearScale","id":"p1011"},"title":{"type":"object","name":"Title","id":"p1008"},"renderers":[{"type":"object","name":"GlyphRenderer","id":"p1039","attributes":{"data_source":{"type":"object","name":"ColumnDataSource","id":"p1033","attributes":{"selected":{"type":"object","name":"Selection","id":"p1034","attributes":{"indices":[],"line_indices":[]}},"selection_policy":{"type":"object","name":"UnionRenderers","id":"p1035"},"data":{"type":"map","entries":[["x",[1,2,3,4,5]],["y",[4,5,5,7,2]]]}}},"view":{"type":"object","name":"CDSView","id":"p1040","attributes":{"filter":{"type":"object","name":"AllIndices","id":"p1041"}}},"glyph":{"type":"object","name":"Scatter","id":"p1036","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"fill_color":{"type":"value","value":"red"}}},"nonselection_glyph":{"type":"object","name":"Scatter","id":"p1037","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.1},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.1},"hatch_alpha":{"type":"value","value":0.1}}},"muted_glyph":{"type":"object","name":"Scatter","id":"p1038","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.2},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.2},"hatch_alpha":{"type":"value","value":0.2}}}}}],"toolbar":{"type":"object","name":"Toolbar","id":"p1009","attributes":{"tools":[{"type":"object","name":"PanTool","id":"p1022"},{"type":"object","name":"WheelZoomTool","id":"p1023","attributes":{"renderers":"auto"}},{"type":"object","name":"BoxZoomTool","id":"p1024","attributes":{"overlay":{"type":"object","name":"BoxAnnotation","id":"p1025","attributes":{"syncable":false,"level":"overlay","visible":false,"left":{"type":"number","value":"nan"},"right":{"type":"number","value":"nan"},"top":{"type":"number","value":"nan"},"bottom":{"type":"number","value":"nan"},"left_units":"canvas","right_units":"canvas","top_units":"canvas","bottom_units":"canvas","line_color":"black","line_alpha":1.0,"line_width":2,"line_dash":[4,4],"fill_color":"lightgrey","fill_alpha":0.5}}}},{"type":"object","name":"SaveTool","id":"p1030"},{"type":"object","name":"ResetTool","id":"p1031"},{"type":"object","name":"HelpTool","id":"p1032"}]}},"left":[{"type":"object","name":"LinearAxis","id":"p1017","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1018","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1019"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1020"}}}],"below":[{"type":"object","name":"LinearAxis","id":"p1012","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1013","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1014"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1015"}}}],"center":[{"type":"object","name":"Grid","id":"p1016","attributes":{"axis":{"id":"p1012"}}},{"type":"object","name":"Grid","id":"p1021","attributes":{"dimension":1,"axis":{"id":"p1017"}}}]}}]}}
          </script>
          <script type="text/javascript">
            (function() {
              const fn = function() {
                Bokeh.safely(function() {
                  (function(root) {
                    function embed_document(root) {
                    const docs_json = document.getElementById('b8c9ab1f-d406-438e-9d5f-32ed50e804a9').textContent;
                    const render_items = [{"docid":"a27876f0-ca97-4031-b871-4addcdc76156","roots":{"p1001":"b6a91bc0-10db-4e1a-a996-e08596853fce"},"root_ids":["p1001"]}];
                    root.Bokeh.embed.embed_items(docs_json, render_items);
                    }
                    if (root.Bokeh !== undefined) {
                      embed_document(root);
                    } else {
                      let attempts = 0;
                      const timer = setInterval(function(root) {
                        if (root.Bokeh !== undefined) {
                          clearInterval(timer);
                          embed_document(root);
                        } else {
                          attempts++;
                          if (attempts > 100) {
                            clearInterval(timer);
                            console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                          }
                        }
                      }, 10, root)
                    }
                  })(window);
                });
              };
              if (document.readyState != "loading") fn();
              else document.addEventListener("DOMContentLoaded", fn);
            })();
          </script>
        </body>
      </html>`,
    title: 'Caption for Bokeh Plot 2',
    showTitle: true,
  },
  {
    id: 3,
    htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Static HTML file</title>
          <style>
            html, body {
              box-sizing: border-box;
              display: flow-root;
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
          <script type="text/javascript" src="https://cdn.bokeh.org/bokeh/release/bokeh-3.4.1.min.js"></script>
          <script type="text/javascript">
              Bokeh.set_log_level("info");
          </script>
        </head>
        <body>
          <div id="b6a91bc0-10db-4e1a-a996-e08596853fce" data-root-id="p1001" style="display: contents;"></div>

          <script type="application/json" id="b8c9ab1f-d406-438e-9d5f-32ed50e804a9">
            {"a27876f0-ca97-4031-b871-4addcdc76156":{"version":"3.4.1","title":"Bokeh Application","roots":[{"type":"object","name":"Figure","id":"p1001","attributes":{"height":250,"max_width":500,"sizing_mode":"stretch_width","x_range":{"type":"object","name":"DataRange1d","id":"p1002"},"y_range":{"type":"object","name":"DataRange1d","id":"p1003"},"x_scale":{"type":"object","name":"LinearScale","id":"p1010"},"y_scale":{"type":"object","name":"LinearScale","id":"p1011"},"title":{"type":"object","name":"Title","id":"p1008"},"renderers":[{"type":"object","name":"GlyphRenderer","id":"p1039","attributes":{"data_source":{"type":"object","name":"ColumnDataSource","id":"p1033","attributes":{"selected":{"type":"object","name":"Selection","id":"p1034","attributes":{"indices":[],"line_indices":[]}},"selection_policy":{"type":"object","name":"UnionRenderers","id":"p1035"},"data":{"type":"map","entries":[["x",[1,2,3,4,5]],["y",[4,5,5,7,2]]]}}},"view":{"type":"object","name":"CDSView","id":"p1040","attributes":{"filter":{"type":"object","name":"AllIndices","id":"p1041"}}},"glyph":{"type":"object","name":"Scatter","id":"p1036","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"fill_color":{"type":"value","value":"red"}}},"nonselection_glyph":{"type":"object","name":"Scatter","id":"p1037","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.1},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.1},"hatch_alpha":{"type":"value","value":0.1}}},"muted_glyph":{"type":"object","name":"Scatter","id":"p1038","attributes":{"x":{"type":"field","field":"x"},"y":{"type":"field","field":"y"},"size":{"type":"value","value":15},"line_color":{"type":"value","value":"#1f77b4"},"line_alpha":{"type":"value","value":0.2},"fill_color":{"type":"value","value":"red"},"fill_alpha":{"type":"value","value":0.2},"hatch_alpha":{"type":"value","value":0.2}}}}}],"toolbar":{"type":"object","name":"Toolbar","id":"p1009","attributes":{"tools":[{"type":"object","name":"PanTool","id":"p1022"},{"type":"object","name":"WheelZoomTool","id":"p1023","attributes":{"renderers":"auto"}},{"type":"object","name":"BoxZoomTool","id":"p1024","attributes":{"overlay":{"type":"object","name":"BoxAnnotation","id":"p1025","attributes":{"syncable":false,"level":"overlay","visible":false,"left":{"type":"number","value":"nan"},"right":{"type":"number","value":"nan"},"top":{"type":"number","value":"nan"},"bottom":{"type":"number","value":"nan"},"left_units":"canvas","right_units":"canvas","top_units":"canvas","bottom_units":"canvas","line_color":"black","line_alpha":1.0,"line_width":2,"line_dash":[4,4],"fill_color":"lightgrey","fill_alpha":0.5}}}},{"type":"object","name":"SaveTool","id":"p1030"},{"type":"object","name":"ResetTool","id":"p1031"},{"type":"object","name":"HelpTool","id":"p1032"}]}},"left":[{"type":"object","name":"LinearAxis","id":"p1017","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1018","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1019"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1020"}}}],"below":[{"type":"object","name":"LinearAxis","id":"p1012","attributes":{"ticker":{"type":"object","name":"BasicTicker","id":"p1013","attributes":{"mantissas":[1,2,5]}},"formatter":{"type":"object","name":"BasicTickFormatter","id":"p1014"},"major_label_policy":{"type":"object","name":"AllLabels","id":"p1015"}}}],"center":[{"type":"object","name":"Grid","id":"p1016","attributes":{"axis":{"id":"p1012"}}},{"type":"object","name":"Grid","id":"p1021","attributes":{"dimension":1,"axis":{"id":"p1017"}}}]}}]}}
          </script>
          <script type="text/javascript">
            (function() {
              const fn = function() {
                Bokeh.safely(function() {
                  (function(root) {
                    function embed_document(root) {
                    const docs_json = document.getElementById('b8c9ab1f-d406-438e-9d5f-32ed50e804a9').textContent;
                    const render_items = [{"docid":"a27876f0-ca97-4031-b871-4addcdc76156","roots":{"p1001":"b6a91bc0-10db-4e1a-a996-e08596853fce"},"root_ids":["p1001"]}];
                    root.Bokeh.embed.embed_items(docs_json, render_items);
                    }
                    if (root.Bokeh !== undefined) {
                      embed_document(root);
                    } else {
                      let attempts = 0;
                      const timer = setInterval(function(root) {
                        if (root.Bokeh !== undefined) {
                          clearInterval(timer);
                          embed_document(root);
                        } else {
                          attempts++;
                          if (attempts > 100) {
                            clearInterval(timer);
                            console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                          }
                        }
                      }, 10, root)
                    }
                  })(window);
                });
              };
              if (document.readyState != "loading") fn();
              else document.addEventListener("DOMContentLoaded", fn);
            })();
          </script>
        </body>
      </html>`,
    title: 'Caption for Bokeh Plot 3',
    showTitle: true,
  },
  // ... more plots
];

export const questionDataPY = [
  {
    id: 1,
    src: 'https://45wrtk-8050.csb.app/',
    title: '1 (hidden: gpt-4-turbo)',
    showTitle: true,
  },
  {
    id: 2,
    src: 'https://45wrtk-8050.csb.app/',
    title: '2 (hidden: dolphin-mixtral-8x7b)',
    showTitle: true,
  },
  {
    id: 3,
    src: 'https://45wrtk-8050.csb.app/',
    title: '3 (hidden: phind-codellama-34b)',
    showTitle: true,
  },
];

export const multiSelectOptions = [
  { value: 'opt1', label: 'There are 8 rings' },
  { value: 'output2', label: 'All the rings are moving' },
  { value: 'output3', label: 'Earth is the first planet in the solarsystem' },
  {
    value: 'output4',
    label: 'The function returns a list where even numbers are incremented by 2 and odd numbers are decremented by 2.',
  },
  { value: 'output5', label: 'The output will be [-1, 4, 1, 6, 3, 8]' }, // Corrected 'output#' to 'output3'
];

export const dialogue = [
  {
    dialogue: [
      {
        role: 'user',
        message: 'Hello! What is your name?',
      },
      {
        role: 'ai',
        message: 'Hello, nice to meet you! My name is Llama 3.',
      },
    ],
    task: 'DIALOGUE',
    criteria: [
      {
        type: 'ranking',
        options: ['Image 1', 'Image 2'],
      },
      {
        type: 'multi-select',
        options: ['The image is Safe For Work (SFW).', 'The code does not have any malicious intent.'],
      },
      {
        type: 'score',
        min: 1.0,
        max: 10.0,
      },
    ],
  },
  {
    dialogue: [],
    task: 'xxx',
    criteria: [],
  },
];
