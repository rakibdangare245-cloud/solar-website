import { forwardRef, useEffect, useRef, type Ref } from 'react';
import gsap from 'gsap';

const FLOW_PATH = 'M 60 84 C 170 44, 250 124, 372 84 S 560 44, 688 84 S 900 124, 1052 84';

const NODES = [
  { x: 60, label: 'Sun' },
  { x: 372, label: 'Solar Panel' },
  { x: 688, label: 'Home' },
  { x: 1052, label: 'Energy Use' },
] as const;

const DOT_COUNT = 3;
const DOT_DURATION = 5.2;

export const EnergyFlow = forwardRef(function EnergyFlow(_props, ref: Ref<HTMLDivElement>) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    if (!length) return;

    const tweens: gsap.core.Tween[] = [];

    tweens.push(gsap.to('.energy-flow__stream', {
      strokeDashoffset: -240, duration: 6, ease: 'none', repeat: -1,
    }));

    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;
      const state = { t: 0 };
      tweens.push(gsap.to(state, {
        t: 1, duration: DOT_DURATION, ease: 'none', repeat: -1,
        delay: index * (DOT_DURATION / DOT_COUNT),
        onUpdate: () => {
          const point = path.getPointAtLength(state.t * length);
          dot.setAttribute('cx', point.x.toFixed(2));
          dot.setAttribute('cy', point.y.toFixed(2));
        },
      }));
    });

    return () => { tweens.forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="energy-flow" ref={ref} aria-hidden="true">
      <svg className="energy-flow__svg" viewBox="0 0 1112 168" preserveAspectRatio="xMidYMid meet">
        <path className="energy-flow__base" d={FLOW_PATH} />
        <path className="energy-flow__stream" d={FLOW_PATH} ref={pathRef} />

        {NODES.map((node) => (
          <g key={node.label}>
            <circle className="energy-flow__node" cx={node.x} cy={84} r={4} />
            <text className="energy-flow__label" x={node.x} y={132} textAnchor="middle">{node.label}</text>
          </g>
        ))}

        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <circle
            key={index}
            className="energy-flow__dot"
            r={2.6}
            cx={NODES[0].x}
            cy={84}
            ref={(el) => { dotRefs.current[index] = el; }}
          />
        ))}
      </svg>
    </div>
  );
});
