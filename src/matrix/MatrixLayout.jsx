import { useEffect } from "react";

export default function MatrixLayout(props) {
  // toggle which headers are active on each axis
  function msClick(resource, axis) {
    if (axis === "x") {
      props.setXState((prevState) => {
        if ([...prevState].includes(resource)) {
          return [...prevState].filter((element) => element !== resource);
        } else {
          return [...prevState, resource];
        }
      });
      props.setYState((prevState) => {
        if ([...prevState].includes(resource)) {
          return [...prevState].filter((element) => element !== resource);
        } else {
          return [...prevState];
        }
      });
    }
    if (axis === "y") {
      props.setYState((prevState) => {
        if ([...prevState].includes(resource)) {
          return [...prevState].filter((element) => element !== resource);
        } else {
          return [...prevState, resource];
        }
      });
      props.setXState((prevState) => {
        if ([...prevState].includes(resource)) {
          return [...prevState].filter((element) => element !== resource);
        } else {
          return [...prevState];
        }
      });
    }
  }

  // create the list items with buttons for each header selector
  const xItemList = props.axisObjects.map((item) => (
    <li key={item.value} className="ms-element">
      {/* <label
        key={"label" + item.value}
        id={"ms-x-" + item.value}
        className="ms-label"
      ></label> */}
      <input
        key={"input" + item.value}
        type="button"
        className="ms-input-button"
        value={item.label}
        onClick={() => {
          msClick(item.value, "x");
        }}
      />
    </li>
  ));
  const yItemList = props.axisObjects.map((item) => (
    <li key={item.value} className="ms-element">
      {/* <label
        key={"label" + item.value}
        id={"ms-y-" + item.value}
        className="ms-label"
      >
        {item.label}
      </label> */}
      <input
        key={"input" + item.value}
        type="button"
        className="ms-input-button"
        value={item.label}
        onClick={() => {
          msClick(item.value, "y");
        }}
      />
    </li>
  ));

  // update the styling of the buttons whenever the state changes
  useEffect(() => {
    // Array.from(document.querySelectorAll(".ms-active")).forEach((element) =>
    //   element.classList.remove("ms-active")
    // );
    // if (!props.xState.length || !props.yState.length) {
    //   Array.from(document.querySelectorAll(".ms-label")).forEach((element) =>
    //     element.classList.add("ms-0dimensional")
    //   );
    // } else {
    //   Array.from(document.querySelectorAll(".ms-label")).forEach((element) =>
    //     element.classList.remove("ms-0dimensional")
    //   );
    // }
    // props.xState.forEach((element) =>
    //   document.getElementById(`ms-x-${element}`).classList.add("ms-active")
    // );
    // props.yState.forEach((element) =>
    //   document.getElementById(`ms-y-${element}`).classList.add("ms-active")
    // );
  }, [props.xState, props.yState]);

  // useEffect(() => {
  //   console.log(props.xState, props.yState);
  // }, [props.xState, props.yState]);

  return (
    <div className="ms-container">
      <h3>Select matrix dimensions</h3>
      <ul>{xItemList}</ul>
      <ul>{yItemList}</ul>
    </div>
  );
}
