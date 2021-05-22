import { GameEngine } from "react-native-game-engine";
import React, { useRef, useState } from "react";
import Constants from "./Constants";
import { StyleSheet, Text, View } from "react-native";
import Matter from "matter-js";
import Bird from "./Components/Bird";
import Wall from "./Components/Wall";
import Physics from "./Physics";
const App = () => {
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
    Matter.World.add(world, [bird, floor]);
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
    };
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={engineRef}
        style={styles.gameEngineStyle}
        systems={[Physics]}
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
