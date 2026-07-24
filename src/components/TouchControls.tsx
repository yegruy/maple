import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sword, Sparkles, Hand, ArrowBigUp } from 'lucide-react';

interface TouchControlsProps {
  touchInputRef: React.MutableRefObject<{
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
    attack: boolean;
    skill1: boolean;
    skill2: boolean;
    pickup: boolean;
  }>;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ touchInputRef }) => {
  const setTouch = (key: keyof typeof touchInputRef.current, val: boolean) => {
    touchInputRef.current[key] = val;
  };

  return (
    <div className="absolute inset-x-0 bottom-16 pointer-events-none p-3 flex justify-between items-end md:hidden z-20">
      {/* D-Pad Joystick */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1 bg-slate-900/80 p-2 rounded-full border border-amber-500/40 backdrop-blur-sm">
        <div />
        <button
          onTouchStart={() => setTouch('up', true)}
          onTouchEnd={() => setTouch('up', false)}
          onMouseDown={() => setTouch('up', true)}
          onMouseUp={() => setTouch('up', false)}
          className="w-11 h-11 bg-slate-800 active:bg-amber-600 rounded-lg flex items-center justify-center text-amber-300 border border-slate-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onTouchStart={() => setTouch('left', true)}
          onTouchEnd={() => setTouch('left', false)}
          onMouseDown={() => setTouch('left', true)}
          onMouseUp={() => setTouch('left', false)}
          className="w-11 h-11 bg-slate-800 active:bg-amber-600 rounded-lg flex items-center justify-center text-amber-300 border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-11 h-11 bg-slate-900 rounded-lg border border-slate-800" />
        <button
          onTouchStart={() => setTouch('right', true)}
          onTouchEnd={() => setTouch('right', false)}
          onMouseDown={() => setTouch('right', true)}
          onMouseUp={() => setTouch('right', false)}
          className="w-11 h-11 bg-slate-800 active:bg-amber-600 rounded-lg flex items-center justify-center text-amber-300 border border-slate-700"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div />
        <button
          onTouchStart={() => setTouch('down', true)}
          onTouchEnd={() => setTouch('down', false)}
          onMouseDown={() => setTouch('down', true)}
          onMouseUp={() => setTouch('down', false)}
          className="w-11 h-11 bg-slate-800 active:bg-amber-600 rounded-lg flex items-center justify-center text-amber-300 border border-slate-700"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <div />
      </div>

      {/* Action Buttons */}
      <div className="pointer-events-auto flex items-end gap-2">
        <div className="flex flex-col gap-2">
          {/* Pickup Button */}
          <button
            onTouchStart={() => setTouch('pickup', true)}
            onTouchEnd={() => setTouch('pickup', false)}
            onMouseDown={() => setTouch('pickup', true)}
            onMouseUp={() => setTouch('pickup', false)}
            className="w-11 h-11 rounded-full bg-emerald-800 active:bg-emerald-600 text-emerald-100 flex items-center justify-center border border-emerald-500/60 shadow"
          >
            <Hand className="w-5 h-5" />
          </button>
          {/* Skill 1 Button */}
          <button
            onTouchStart={() => setTouch('skill1', true)}
            onTouchEnd={() => setTouch('skill1', false)}
            onMouseDown={() => setTouch('skill1', true)}
            onMouseUp={() => setTouch('skill1', false)}
            className="w-11 h-11 rounded-full bg-purple-800 active:bg-purple-600 text-purple-100 flex items-center justify-center border border-purple-500/60 shadow"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Normal Attack Button */}
          <button
            onTouchStart={() => setTouch('attack', true)}
            onTouchEnd={() => setTouch('attack', false)}
            onMouseDown={() => setTouch('attack', true)}
            onMouseUp={() => setTouch('attack', false)}
            className="w-14 h-14 rounded-full bg-red-700 active:bg-red-500 text-red-100 flex items-center justify-center border-2 border-amber-400 shadow-lg font-bold"
          >
            <Sword className="w-7 h-7" />
          </button>
          {/* Jump Button */}
          <button
            onTouchStart={() => setTouch('jump', true)}
            onTouchEnd={() => setTouch('jump', false)}
            onMouseDown={() => setTouch('jump', true)}
            onMouseUp={() => setTouch('jump', false)}
            className="w-14 h-14 rounded-full bg-amber-600 active:bg-amber-400 text-amber-100 flex items-center justify-center border-2 border-amber-300 shadow-lg font-bold"
          >
            <ArrowBigUp className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
