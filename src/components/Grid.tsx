import React from "react";
import DynamicComponent from "./DynamicComponent";

const Grid = ({ blok }: any) => {
  return (
    <div className="grid">
      {blok.columns.map((blok: any) => (
        <DynamicComponent blok={blok} key={blok._uid} />
      ))}
    </div>
  );
};

export default Grid;
