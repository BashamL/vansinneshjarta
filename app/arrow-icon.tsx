type Direction = "right" | "left" | "up" | "down" | "up-right";

const rotations: Record<Direction, number> = {
  right: 0,
  left: 180,
  up: -90,
  down: 90,
  "up-right": -45,
};

export default function ArrowIcon({
  direction = "right",
}: {
  direction?: Direction;
}) {
  return (
    <svg
      className="arrow-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform={`rotate(${rotations[direction]} 12 12)`}
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12h15M14.5 7.5 19 12l-4.5 4.5" />
      </g>
    </svg>
  );
}
