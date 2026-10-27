import React, { useState } from 'react';
import { GridConfig, GridCell } from '../types/exam';
import { Grid, Square, Sparkles, RefreshCw, Check } from 'lucide-react';

interface MathGridDrawerProps {
  initialConfig?: GridConfig | null;
  onSave?: (config: GridConfig) => void;
  readOnly?: boolean;
}

export const MathGridDrawer: React.FC<MathGridDrawerProps> = ({
  initialConfig,
  onSave,
  readOnly = false,
}) => {
  const [rows, setRows] = useState(initialConfig?.rows || 5);
  const [cols, setCols] = useState(initialConfig?.cols || 8);
  const [cellSize, setCellSize] = useState(initialConfig?.cellSize || 28);
  const [title, setTitle] = useState(initialConfig?.title || 'Lưới ô vuông toán học (Mỗi ô 1 cm x 1 cm)');
  const [widthLabel, setWidthLabel] = useState(initialConfig?.widthLabel || '');
  const [heightLabel, setHeightLabel] = useState(initialConfig?.heightLabel || '');
  const [description, setDescription] = useState(
    initialConfig?.description || 'Tính chu vi và diện tích hình được tô màu trên lưới ô vuông.'
  );

  // Grid cells state
  const [cells, setCells] = useState<GridCell[]>(() => {
    if (initialConfig?.cells && initialConfig.cells.length > 0) {
      return initialConfig.cells;
    }
    // Default shape: rectangle in center
    const defaultCells: GridCell[] = [];
    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 4; c++) {
        defaultCells.push({ row: r, col: c, filled: true, color: '#3b82f6' });
      }
    }
    return defaultCells;
  });

  const isCellFilled = (r: number, c: number) => {
    return cells.some((cell) => cell.row === r && cell.col === c && cell.filled);
  };

  const toggleCell = (r: number, c: number) => {
    if (readOnly) return;
    setCells((prev) => {
      const exists = prev.find((cell) => cell.row === r && cell.col === c);
      if (exists) {
        return prev.filter((cell) => !(cell.row === r && cell.col === c));
      } else {
        return [...prev, { row: r, col: c, filled: true, color: '#3b82f6' }];
      }
    });
  };

  // Preset generators
  const applyPreset = (type: 'rectangle' | 'triangle' | 'square' | 'parallelogram' | 'empty') => {
    if (type === 'empty') {
      setCells([]);
      return;
    }
    const newCells: GridCell[] = [];
    if (type === 'square') {
      for (let r = 1; r <= 3; r++) {
        for (let c = 1; c <= 3; c++) {
          newCells.push({ row: r, col: c, filled: true, color: '#3b82f6' });
        }
      }
      setWidthLabel('3 cm');
      setHeightLabel('3 cm');
      setDescription('Hình vuông cạnh 3 ô vuông (3 cm).');
    } else if (type === 'rectangle') {
      for (let r = 1; r <= 3; r++) {
        for (let c = 1; c <= 5; c++) {
          newCells.push({ row: r, col: c, filled: true, color: '#3b82f6' });
        }
      }
      setWidthLabel('5 cm');
      setHeightLabel('3 cm');
      setDescription('Hình chữ nhật chiều dài 5 cm, chiều rộng 3 cm.');
    } else if (type === 'parallelogram') {
      for (let r = 1; r <= 3; r++) {
        const offset = 3 - r;
        for (let c = 1 + offset; c <= 5 + offset; c++) {
          newCells.push({ row: r, col: c, filled: true, color: '#10b981' });
        }
      }
      setWidthLabel('Đáy 5 cm');
      setHeightLabel('Chiều cao 3 cm');
      setDescription('Hình bình hành có độ dài đáy 5 cm và chiều cao 3 cm.');
    } else if (type === 'triangle') {
      for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= r; c++) {
          newCells.push({ row: r, col: c, filled: true, color: '#8b5cf6' });
        }
      }
      setWidthLabel('Đáy 4 cm');
      setHeightLabel('Chiều cao 4 cm');
      setDescription('Hình tam giác vuông có 2 cạnh góc vuông 4 cm.');
    }
    setCells(newCells);
  };

  const filledCount = cells.filter((c) => c.filled).length;

  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'math-grid',
        rows,
        cols,
        cellSize,
        title,
        widthLabel,
        heightLabel,
        description,
        cells,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset('rectangle')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            >
              Hình chữ nhật
            </button>
            <button
              onClick={() => applyPreset('square')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            >
              Hình vuông
            </button>
            <button
              onClick={() => applyPreset('parallelogram')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            >
              Hình bình hành
            </button>
            <button
              onClick={() => applyPreset('triangle')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            >
              Tam giác
            </button>
            <button
              onClick={() => applyPreset('empty')}
              type="button"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Xóa ô đã tô"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Canvas Canvas View */}
      <div className="my-4 flex flex-col items-center justify-center overflow-x-auto p-4 bg-slate-50/70 rounded-lg border border-dashed border-slate-200">
        <div className="relative inline-block select-none">
          {/* Top Width Label */}
          {widthLabel && (
            <div className="text-center text-xs font-semibold text-blue-600 mb-1 tracking-wide">
              ↔ {widthLabel}
            </div>
          )}

          <div className="flex items-center">
            {/* Left Height Label */}
            {heightLabel && (
              <div className="text-xs font-semibold text-blue-600 -rotate-90 pr-2 whitespace-nowrap">
                ↕ {heightLabel}
              </div>
            )}

            {/* Grid SVG / Table */}
            <div
              className="grid gap-[1px] bg-slate-300 p-[1px] rounded shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: rows }).map((_, rIdx) =>
                Array.from({ length: cols }).map((_, cIdx) => {
                  const r = rIdx + 1;
                  const c = cIdx + 1;
                  const filled = isCellFilled(r, c);
                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => toggleCell(r, c)}
                      className={`transition-colors cursor-${readOnly ? 'default' : 'pointer'} flex items-center justify-center text-[10px] ${
                        filled
                          ? 'bg-blue-500 text-white font-medium border border-blue-600/30'
                          : 'bg-white hover:bg-blue-50 text-slate-300'
                      }`}
                      style={{ width: cellSize, height: cellSize }}
                      title={`Hàng ${r}, Cột ${c}`}
                    >
                      {filled && !readOnly && <Check className="w-3 h-3 opacity-80" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div
              className="border border-slate-300 bg-white"
              style={{ width: 14, height: 14 }}
            />
            <span>1 ô vuông = 1 cm² (cạnh 1 cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="bg-blue-500 rounded-sm"
              style={{ width: 14, height: 14 }}
            />
            <span>
              Đã tô màu: <strong className="text-blue-700">{filledCount} cm²</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Editor Controls */}
      {!readOnly && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-slate-600">
              Số hàng:
              <input
                type="number"
                min={3}
                max={12}
                value={rows}
                onChange={(e) => setRows(Math.max(2, Math.min(12, parseInt(e.target.value) || 4)))}
                className="w-12 px-1.5 py-0.5 border border-slate-200 rounded text-center text-slate-800"
              />
            </label>
            <label className="flex items-center gap-1 text-slate-600">
              Số cột:
              <input
                type="number"
                min={3}
                max={16}
                value={cols}
                onChange={(e) => setCols(Math.max(2, Math.min(16, parseInt(e.target.value) || 6)))}
                className="w-12 px-1.5 py-0.5 border border-slate-200 rounded text-center text-slate-800"
              />
            </label>
            <label className="flex items-center gap-1 text-slate-600">
              Cỡ ô (px):
              <input
                type="number"
                min={20}
                max={48}
                value={cellSize}
                onChange={(e) => setCellSize(parseInt(e.target.value) || 28)}
                className="w-12 px-1.5 py-0.5 border border-slate-200 rounded text-center text-slate-800"
              />
            </label>
          </div>

          {onSave && (
            <button
              onClick={handleSave}
              type="button"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Lưu cấu hình lưới vào câu hỏi
            </button>
          )}
        </div>
      )}
    </div>
  );
};
