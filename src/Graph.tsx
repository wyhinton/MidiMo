import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";


interface EnvelopeGraphProps {
  defaultXa: number;
  defaultXd: number;
  defaultXr: number;
  defaultYa: number;
  defaultYs: number;
  ya: number;
  ys: number;
  ratio?: {
    xa: number;
    xd: number;
    xr: number;
  };
  dndBox?: {
    height: number;
    width: number;
  };
  onChange?: (values: {
    xa: number;
    xd: number;
    xr: number;
    ys: number;
  }) => void;
  style?: React.CSSProperties;
  styles: {
    line: React.CSSProperties;
    dndBox: React.CSSProperties;
    dndBoxActive: React.CSSProperties;
    corners: {
      strokeWidth: number;
      length: number;
      stroke: string;
    };
  };
  corners?: boolean;
}



const EnvelopeGraph: React.FC<EnvelopeGraphProps> = (props) => {
  const [state, setState] = useState<{
    xa: number;
    xd: number;
    xr: number;
    ya: number;
    ys: number;
    drag: string | null;
    svgRatio: { width: number; height: number };
    ratio: {
      xa: number;
      xd: number;
      xr: number;
    };
  }>({ xa: 0, xd: 0, xr: 0, ya: props.ya, ys: props.ys, drag: null, svgRatio: { width: 0, height: 0 }, ratio: { xa: 0, xd: 0, xr: 0 } });

  const {
    defaultXa,
    defaultXd,
    defaultXr,
    defaultYa,
    defaultYs,
    ratio,
  } = props;

  let styles = props.styles

  const computeStyles = () => {
    const computedStyle = window.getComputedStyle(boxRef.current as Element);
    const styles: { [key: string]: number } = {};
    [
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "height",
      "width",
      //@ts-ignore
    ].map((key) => (styles[key] = parseFloat(computedStyle[key])));
    return styles;
  };
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const boxRef = React.createRef<SVGSVGElement>();
  useEffect(() => {



    let initialRatio = {
        xa: 0.25,
        xd: 0.25,
        xr: 0.25,
    }
    if (ratio){
        initialRatio = ratio 
    }
   
    const xa = defaultXa * viewBox.width * initialRatio.xa;
    const xd = defaultXd * viewBox.width * initialRatio.xd;
    const xr = defaultXr * viewBox.width * initialRatio.xr;

    setState({
      ...state,
      xa,
      xd,
      xr,
      ya: defaultYa,
      ys: defaultYs,
      ratio: initialRatio,
    });

    
  
    styles && (styles = { ...styles, ...props.styles });

    const onWindowResize = () => {
      const { width, height } = computeStyles();

      setState((prevState) => ({
        ...prevState,
        svgRatio: {
          width: width / viewBox.width,
          height: height / viewBox.height,
        },
      }));
    };




    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("mouseup", handleMouseUp);
    //   window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const defaultMargin = 5;
  const viewBox = {
    width: 100,
    height: 20,
    marginTop: defaultMargin,
    marginRight: defaultMargin,
    marginBottom: defaultMargin,
    marginLeft: defaultMargin,
    // marginTop:
    //   2 *
    //     (styles.corners.strokeWidth +
    //       styles.dndBox.height / 2 +
    //       styles.dndBox.strokeWidth) || 0,
    // marginRight:
    //   2 *
    //     (styles.corners.strokeWidth +
    //       styles.dndBox.width / 2 +
    //       styles.dndBox.strokeWidth) || 0,
    // marginBottom:
    //   2 *
    //     (styles.corners.strokeWidth +
    //       styles.dndBox.height / 2 +
    //       styles.dndBox.strokeWidth) || 0,
    // marginLeft:
    //   2 *
    //     (styles.corners.strokeWidth +
    //       styles.dndBox.width / 2 +
    //       styles.dndBox.strokeWidth) || 0,
  };

  const getPhaseLengths = () => {
    const { xa, xd, xr } = state;
    const absoluteS = viewBox.width - xa - xd - 0.25 * viewBox.width;
    return [xa, xd, absoluteS, xr];
  };

  const generatePath = () => {
    const { ys } = state;
    const [
      attackWidth,
      decayWidth,
      sustainWidth,
      releaseWidth,
    ] = getPhaseLengths();

    const strokes = [];
    strokes.push("M 0 " + viewBox.height);
    strokes.push(exponentialStrokeTo(attackWidth, -viewBox.height));
    strokes.push(exponentialStrokeTo(decayWidth, viewBox.height * (1 - ys)));
    strokes.push(linearStrokeTo(sustainWidth, 0));
    strokes.push(exponentialStrokeTo(releaseWidth, viewBox.height * ys));

    return strokes.join(" ");
  };

  const exponentialStrokeTo = (dx: number, dy: number) => {
    return ["c", dx / 5, dy / 2, dx / 2, dy, dx, dy].join(" ");
  };

  const linearStrokeTo = (dx: number, dy: number) => {
    return `l ${dx} ${dy}`;
  };

  const renderCorners = () => {
    const { marginTop, marginRight, marginBottom, marginLeft } = viewBox;
    const { length, stroke, strokeWidth } = styles.corners;

    return [
      <path
        key="top-left-corner"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={`M ${strokeWidth},${strokeWidth + length} V ${strokeWidth} H ${
          strokeWidth + length
        }`}
      />,
      <path
        key="top-right-corner"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={`M ${viewBox.width +
          marginLeft +
          marginRight -
          length -
          strokeWidth},${strokeWidth} H ${viewBox.width +
          marginLeft +
          marginRight -
          strokeWidth} V ${strokeWidth + length}`}
      />,
      <path
        key="bottom-right-corner"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={`M ${viewBox.width +
          marginLeft +
          marginRight -
          strokeWidth},${viewBox.height +
          marginTop +
          marginBottom -
          strokeWidth -
          length} V ${viewBox.height + marginTop + marginBottom - strokeWidth} H ${
          viewBox.width + marginLeft + marginRight - length - strokeWidth
        }`}
      />,
      <path
        key="bottom-left-corner"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={`M ${length + strokeWidth},${viewBox.height +
          marginTop +
          marginBottom -
          strokeWidth} H ${strokeWidth} V ${viewBox.height +
          marginTop +
          marginBottom -
          length -
          strokeWidth}`}
      />,
    ];
  };

  const handleMouseUp = () => {
    setState((prevState) => ({ ...prevState, drag: null }));
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    console.log(event)
    const [
      attackWidth,
      decayWidth,
      sustainWidth,
      releaseWidth,
    ] = getPhaseLengths();
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = computeStyles();
    const { marginTop, marginRight, marginBottom, marginLeft } = viewBox;
    const { drag, xa, xd, xr, ratio, svgRatio } = state;

    if (drag) {
      const rect = (boxRef.current as any).getBoundingClientRect();
      if (drag === "attack") {
        const xaNew =
          (event.clientX - paddingLeft - rect.left) / svgRatio.width -
          marginLeft;
        let newState = { ...state };
        if (xaNew <= ratio.xa * viewBox.width && xaNew >= 0) {
          newState.xa = xaNew;
        }
        setState(newState);
           setCurrentPosition({
        x: attackWidth,
        y: viewBox.height,
      });
      } else if (drag === "decaysustain") {
        const ysNew =
          1 -
          (event.clientY - paddingTop - rect.top) /
            svgRatio.height /
            viewBox.height;

        let newState = { ...state };
        if (ysNew >= 0 && ysNew <= 1) {
          newState.ys = ysNew;
        }
        const xdNew =
          (event.clientX -
            paddingLeft -
            rect.left -
            attackWidth * svgRatio.width) /
          svgRatio.width;

        if (xdNew >= 0 && xdNew <= ratio.xd * viewBox.width) {
          newState.xd = xdNew;
        }

        setState(newState);
      } else if (drag === "release") {
        const xrNew =
          (event.clientX -
            paddingLeft -
            rect.left -
            (attackWidth + decayWidth + sustainWidth) * svgRatio.width) /
          svgRatio.width;
        if (xrNew >= 0 && xrNew <= ratio.xr * viewBox.width) {
          setState((prevState) => ({ ...prevState, xr: xrNew }));
        }
      }
    }
  };

  const handleMouseDown = (type: string) => {
    setState((prevState) => ({ ...prevState, drag: type }));
  };

  const renderDnDRect = (type: string) => {
    const { marginTop, marginRight, marginBottom, marginLeft } = viewBox;
    const [
      attackWidth,
      decayWidth,
      sustainWidth,
      releaseWidth,
    ] = getPhaseLengths();
    const { ys, drag } = state;
    const rHeight = parseFloat(styles.dndBox.height as string);
    const rWidth = parseFloat(styles.dndBox.width as string);

    let x, y;
    if (type === "attack") {
      x = marginLeft + attackWidth - rWidth / 2;
      y = marginTop - rHeight / 2;
    } else if (type === "decaysustain") {
      x = marginLeft + attackWidth + decayWidth - rWidth / 2;
      y = marginTop + viewBox.height * (1 - ys) - rHeight / 2;
    } else if (type === "release") {
      x =
        marginLeft +
        attackWidth +
        decayWidth +
        sustainWidth +
        releaseWidth -
        rWidth / 2;
      y = marginTop + viewBox.height - rHeight / 2;
    } else {
      throw new Error("Invalid type for DnDRect");
    }

    return (
      <rect
        onMouseDown={() => handleMouseDown(type)}
        x={x}
        y={y}
        width={rWidth}
        height={rHeight}
        style={{
          pointerEvents: "all",
          fill: drag === type ? styles.dndBoxActive.fill : styles.dndBox.fill,
          stroke:
            drag === type ? styles.dndBoxActive.stroke : styles.dndBox.stroke,
          strokeWidth: styles.dndBox.strokeWidth,
        }}
      />
    );
  };

  const { corners, style } = props;
  const { drag } = state;

  const w = viewBox.width + viewBox.marginLeft + viewBox.marginRight;
  const h = viewBox.height + viewBox.marginTop + viewBox.marginBottom;
  const vb = `0 0 ${w} ${h}`;
  const {marginLeft, marginTop } = viewBox;
  return (
    <svg
      style={style}
      onDragStart={() => false}
      viewBox={vb}
      ref={boxRef}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <path
        transform={`translate(${marginLeft}, ${marginTop})`}
        d={generatePath()}
        style={{ ...styles.line }}
        vectorEffect="non-scaling-stroke"
      />
        <circle
        cx={marginLeft + currentPosition.x}
        cy={marginTop + currentPosition.y}
        r="1" // Adjust the radius of the circle as per your requirement
        fill="red" // You can change the color of the circle here
    />
      {corners ? renderCorners() : null}
      {renderDnDRect("attack")}
      {renderDnDRect("decaysustain")}
      {renderDnDRect("release")}
    </svg>
  );
};

export default EnvelopeGraph;
