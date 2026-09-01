import React from 'react';
import { Scissors, Hand } from 'lucide-react';

export interface CardOverlayIndicatorsProps {
  isSplitPoint: boolean;
  splitIndex: number;
  pageNumber: number;
  isHeld: boolean;
  holdProgress: number;
}

export const CardOverlayIndicators: React.FC<CardOverlayIndicatorsProps> = ({
  isSplitPoint,
  splitIndex,
  pageNumber,
  isHeld,
  holdProgress,
}) => {
  return (
    <>
      {/* Real-time hold-to-reorder progress bar */}
      {holdProgress > 0 && !isHeld && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-bg-subtle z-30 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-75"
            style={{ width: `${holdProgress}%` }}
          />
        </div>
      )}

      {/* Attached to hold badge */}
      {isHeld && (
        <div className="absolute inset-0 bg-amber-500/20 border-2 border-dashed border-amber-500 z-30 flex flex-col items-center justify-center p-2 text-center pointer-events-none animate-pulse">
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Hand className="h-3 w-3" />
            Holding Page
          </span>
          <span className="text-[10px] text-amber-900 font-semibold mt-1 bg-white/80 px-1.5 py-0.5 rounded">
            Click target to drop
          </span>
        </div>
      )}

      {/* Blue Split Point Cut Overlay */}
      {isSplitPoint && (
        <div className="absolute inset-0 bg-blue-600/35 backdrop-blur-[0.5px] z-20 flex flex-col items-center justify-between p-2 pointer-events-none transition-all">
          <div className="w-full flex justify-end">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Scissors className="h-2.5 w-2.5" />
              Cut #{splitIndex + 1}
            </span>
          </div>

          <div className="bg-blue-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1">
            <Scissors className="h-3 w-3" />
            <span>Cut after p.{pageNumber}</span>
          </div>

          <div className="w-full flex justify-center">
            <span className="bg-white/95 text-blue-800 text-[9px] font-mono font-semibold px-1 py-0.5 rounded shadow-xs border border-blue-200">
              Part {splitIndex + 1}
            </span>
          </div>
        </div>
      )}

      {/* Cut scissors badge at right edge */}
      {isSplitPoint && (
        <div
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 bg-blue-600 text-white rounded-full p-1 shadow-md border-2 border-white pointer-events-none"
          title={`Document cut after page ${pageNumber}`}
        >
          <Scissors className="h-3.5 w-3.5" />
        </div>
      )}
    </>
  );
};
