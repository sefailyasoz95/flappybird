import { GameEngine } from "react-native-game-engine";
import React, { useRef, useState } from "react";
import Constants from "./Constants";
import { StyleSheet, Text, View } from "react-native";
import Matter from "matter-js";
import Bird from "./Components/Bird";
import Wall from "./Components/Wall";
import Physics from "./Physics";

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generatePipes = () => {
  let topPipeHeight = randomBetween(75, Constants.MAX_HEIGHT / 2 - 100);
  let bottomPipeHeight =
    Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;
  let pipes = [topPipeHeight, bottomPipeHeight];
  if (Math.random() < 0.5) {
    pipes = pipes.reverse();
  }
  return pipes;
};
const App = () => {
  const [running, setRunning] = useState(true);
  const engineRef = useRef();
  const setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false }); // new instance of Matter
    let world = engine.world;
    let bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,
      Constants.MAX_HEIGHT / 2,
      50,
      50
    );
    let floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true }
    );
    let ceiling = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true }
    );
    let [pipeHeightOne, pipeHeightTwo] = generatePipes();
    let pipe1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      pipeHeightOne / 2,
      Constants.PIPE_WIDTH,
      pipeHeightOne,
      { isStatic: true }
    );
    let pipe2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipeHeightTwo / 2,
      Constants.PIPE_WIDTH,
      pipeHeightTwo,
      { isStatic: true }
    );

    let [pipeHeightThree, pipeHeightFour] = generatePipes();
    let pipe3 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      pipeHeightThree / 2,
      Constants.PIPE_WIDTH,
      pipeHeightThree,
      { isStatic: true }
    );
    let pipe4 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipeHeightFour / 2,
      Constants.PIPE_WIDTH,
      pipeHeightFour,
      { isStatic: true }
    );

    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;
      console.log("pairs:", pairs);

      engineRef.dispatch({ type: "game-over" });
    });

    return {
      physics: { engine: engine, world: world },
      bird: { body: bird, size: [50, 50], color: "red", renderer: Bird },
      floor: {
        body: floor,
        size: [Constants.MAX_WIDTH, 50],
        color: "purple",
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.MAX_WIDTH, 50],
        color: "purple",
        renderer: Wall,
      },
      pipe1: {
        body: pipe1,
        size: [Constants.PIPE_WIDTH, pipeHeightOne],
        color: "green",
        renderer: Wall,
      },
      pipe2: {
        body: pipe2,
        size: [Constants.PIPE_WIDTH, pipeHeightTwo],
        color: "green",
        renderer: Wall,
      },
      pipe3: {
        body: pipe3,
        size: [Constants.PIPE_WIDTH, pipeHeightThree],
        color: "green",
        renderer: Wall,
      },
      pipe4: {
        body: pipe4,
        size: [Constants.PIPE_WIDTH, pipeHeightFour],
        color: "green",
        renderer: Wall,
      },
    };
  };

  const onEvent = (e) => {
    if (e.type === "game-over") {
      setRunning(false);
    }
  };
  return (
    <View style={styles.container}>
      <GameEngine
        ref={engineRef}
        style={styles.gameEngineStyle}
        systems={[Physics]}
        onEvent={onEvent}
        running={running}
        entities={setupWorld()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gameEngineStyle: {},
});

export default App;
