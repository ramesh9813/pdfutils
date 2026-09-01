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
        <div className="absolute inset-0 bg-blue-600/45 backdrop-blur-[1px] border-2 border-blue-600 z-20 flex flex-col items-center justify-between p-2 pointer-events-none transition-all">
          <div className="w-full flex justify-end">
            <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 border border-blue-400">
              <Scissors className="h-3 w-3" />
              Split Point #{splitIndex + 1}
            </span>
          </div>

          <div className="bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-blue-300">
            <Scissors className="h-3.5 w-3.5" />
            <span>Cut After Page {pageNumber}</span>
          </div>

          <div className="w-full flex justify-center">
            <span className="bg-white text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-blue-200">
              Part {splitIndex + 1} Ends Here
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
