import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { contentContainerStyle } from "../styles";
import BackButton from "../components/BackButton";

// --- PASTE YOUR EXACT CLASSES & CONSTANTS DIRECTLY HERE OR VIA IMPORT ---
const N = "N"; const S = "S"; const W = "W"; const E = "E";
export const CellTypes = {
    H_PATH: [E, W], V_PATH: [N, S],
    NE_LPATH: [N, E], NW_LPATH: [N, W], SW_LPATH: [S, W], SE_LPATH: [S, E],
    NEW_TPATH: [N, E, W], SWN_TPATH: [S, W, N], SEN_TPATH: [S, E, N], SWE_TPATH: [S, W, E],
    CROSS: [N, E, S, W]
};
const DIRECTION_OFFSETS = { [N]: { dx: 0, dy: -1 }, [S]: { dx: 0, dy: 1 }, [E]: { dx: 1, dy: 0 }, [W]: { dx: -1, dy: 0 } };
const OPPOSITE_DIRECTIONS = { [N]: S, [S]: N, [E]: W, [W]: E };

class Cell {
    constructor(directions) { this.avaliableDirections = directions; }
    getAvaliableDirections() { return this.avaliableDirections; }
}

class Map {
    constructor(maxHeight, maxWidth) {
       this.maxHeight = maxHeight; this.maxWidth = maxWidth;
       this.grid = Array.from({ length: maxWidth }, () => Array(maxHeight).fill(null));
       this.currentqueue = [];
       this.generationOrder = [];
    }
    startMap() {
        const startX = Math.floor(Math.random() * (this.maxWidth - 2)) + 1;
        const startY = Math.floor(Math.random() * (this.maxHeight - 2)) + 1;
        this.grid[startX][startY] = new Cell(CellTypes.H_PATH);
        this.currentqueue.push({ x: startX, y: startY });
        this.generationOrder.push({ x: startX, y: startY });
    }
    generateNextCell() {
        if (this.currentqueue.length === 0) return;
        const { x, y } = this.currentqueue.shift();
        const currentCell = this.grid[x][y];
        if (!currentCell) return;
        const directions = currentCell.getAvaliableDirections();
        for (const dir of directions) {
            const offset = DIRECTION_OFFSETS[dir]; if (!offset) continue;
            const nextX = x + offset.dx; const nextY = y + offset.dy;
            if (nextX >= 0 && nextX < this.maxWidth && nextY >= 0 && nextY < this.maxHeight) {
                if (this.grid[nextX][nextY] === null) {
                    const requiredIncoming = OPPOSITE_DIRECTIONS[dir];
                    const validTypes = Object.values(CellTypes).filter(typeDirections => {
                            for (const incomingDir of typeDirections) {
                                if (incomingDir !== requiredIncoming) {
                                    const incomingOffset = DIRECTION_OFFSETS[incomingDir];
                                    const incomingX = nextX + incomingOffset.dx;
                                    const incomingY = nextY + incomingOffset.dy;
                                    if (incomingX >= 0 && incomingX < this.maxWidth && incomingY >= 0 && incomingY < this.maxHeight) {
                                        const neighborCell = this.grid[incomingX][incomingY];
                                        if (neighborCell) {
                                            const neighborDirections = neighborCell.getAvaliableDirections();
                                            if (!neighborDirections.includes(OPPOSITE_DIRECTIONS[incomingDir])) {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }

                            return typeDirections.includes(requiredIncoming)
                        });

                    if (validTypes.length > 0) {
                        const randomType = validTypes[Math.floor(Math.random() * validTypes.length)];
                        this.grid[nextX][nextY] = new Cell(randomType);
                        this.currentqueue.push({ x: nextX, y: nextY });
                        this.generationOrder.push({ x: nextX, y: nextY });
                    }
                }
            }
        }
    }
    generateMap() {
        this.startMap();
        while (this.currentqueue.length > 0) { this.generateNextCell(); }
    }
    getStartCell() {
        return this.generationOrder[0] || null;
    }
    getLastGeneratedCell() {
        return this.generationOrder.length > 0
            ? this.generationOrder[this.generationOrder.length - 1]
            : null;
    }
}
// ------------------------------------------------------------------------

const DIRECTION_GLYPHS = {
    "H_PATH": "─", "V_PATH": "│",
    "NE_LPATH": "└", "NW_LPATH": "┘", "SW_LPATH": "┐", "SE_LPATH": "┌",
    "NEW_TPATH": "┴", "SWN_TPATH": "┤", "SEN_TPATH": "├", "SWE_TPATH": "┬",
    "CROSS": "┼"
};

function getCellGlyph(cell) {
    if (!cell) return "·";
    const dirs = cell.getAvaliableDirections();
    for (const [key, value] of Object.entries(CellTypes)) {
        if (value.length === dirs.length && value.every(d => dirs.includes(d))) {
            return DIRECTION_GLYPHS[key] || "█";
        }
    }
    return "█";
}

function areCellsConnected(map, x, y, dir) {
    const offset = DIRECTION_OFFSETS[dir];
    const nx = x + offset.dx;
    const ny = y + offset.dy;
    if (nx < 0 || nx >= map.maxWidth || ny < 0 || ny >= map.maxHeight) return null;

    const currentCell = map.grid[x][y];
    const neighborCell = map.grid[nx][ny];
    if (!currentCell || !neighborCell) return null;

    const hasOutgoing = currentCell.getAvaliableDirections().includes(dir);
    const hasIncoming = neighborCell.getAvaliableDirections().includes(OPPOSITE_DIRECTIONS[dir]);

    return (hasOutgoing && hasIncoming) ? { x: nx, y: ny } : null;
}

function findPath(map, start, end) {
    if (!start || !end) return null;
    const key = (x, y) => `${x},${y}`;
    const visited = new Set([key(start.x, start.y)]);
    const cameFrom = {};
    const queue = [start];

    while (queue.length > 0) {
        const current = queue.shift();
        if (current.x === end.x && current.y === end.y) {
            const path = [current];
            let node = current;
            while (cameFrom[key(node.x, node.y)]) {
                node = cameFrom[key(node.x, node.y)];
                path.push(node);
            }
            return path.reverse();
        }
        for (const dir of [N, S, E, W]) {
            const neighbor = areCellsConnected(map, current.x, current.y, dir);
            if (neighbor && !visited.has(key(neighbor.x, neighbor.y))) {
                visited.add(key(neighbor.x, neighbor.y));
                cameFrom[key(neighbor.x, neighbor.y)] = current;
                queue.push(neighbor);
            }
        }
    }
    return null;
}

function ProceduralGenTest() {
    const rows = 10;
    const cols = 10;

    const mapInstance = useRef(new Map(rows, cols));
    const [renderTrigger, setRenderTrigger] = useState(0);
    const [path, setPath] = useState(null);
    const [pathSearched, setPathSearched] = useState(false);
    const [showPath, setShowPath] = useState(false); // NEW

    const forceUpdate = () => setRenderTrigger(prev => prev + 1);

    const resetMap = () => {
        mapInstance.current = new Map(rows, cols);
        setPath(null);
        setPathSearched(false);
        setShowPath(false); // NEW
        forceUpdate();
    };

    const handleStartMap = () => {
        mapInstance.current = new Map(rows, cols);
        mapInstance.current.startMap();
        setPath(null);
        setPathSearched(false);
        setShowPath(false); // NEW
        forceUpdate();
    };

    const handleGenerateNextCell = () => {
        mapInstance.current.generateNextCell();
        setPath(null);
        setPathSearched(false);
        setShowPath(false); // NEW
        forceUpdate();
    };

    const handleGenerateMap = () => {
        mapInstance.current = new Map(rows, cols);
        mapInstance.current.generateMap();
        setPath(null);
        setPathSearched(false);
        setShowPath(false); // NEW
        forceUpdate();
    };

    const handleFindPath = () => {
        const map = mapInstance.current;
        const start = map.getStartCell();
        const end = map.getLastGeneratedCell();
        const result = findPath(map, start, end);
        setPath(result);
        setPathSearched(true);
        setShowPath(false); // NEW - require explicit "Show Path" click after (re)computing
    };

    // NEW: toggles visibility of the already-computed path
    const handleTogglePath = () => {
        setShowPath(prev => !prev);
    };

    useEffect(() => {
        handleGenerateMap();
    }, []);

    const currentMap = mapInstance.current;
    const queueLength = currentMap.currentqueue.length;
    const pathSet = new Set((showPath && path ? path : []).map(p => `${p.x},${p.y}`)); // NEW: gated by showPath

    return (
        <Box sx={{ ...contentContainerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <BackButton />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Procedural Map Generator (OOP Class)
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#1e1e1e", fontFamily: "monospace", mb: 2 }}>
                {Array.from({ length: rows }).map((_, y) => (
                    <Box key={y} sx={{ display: "flex", height: 24 }}>
                        {Array.from({ length: cols }).map((_, x) => {
                            const cell = currentMap.grid[x][y];
                            const isQueued = currentMap.currentqueue.some(q => q.x === x && q.y === y);
                            const isOnPath = pathSet.has(`${x},${y}`);
                            return (
                                <Box
                                    key={x}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isOnPath ? "#ff1744" : isQueued ? "#ff9800" : cell ? "#4caf50" : "#555",
                                        backgroundColor: isOnPath ? "rgba(255,23,68,0.15)" : "transparent",
                                        fontWeight: cell ? "bold" : "normal",
                                        fontSize: 18,
                                        border: "1px solid #2e2e2e"
                                    }}
                                >
                                    {getCellGlyph(cell)}
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Paper>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                <Button variant="outlined" color="error" onClick={resetMap}>
                    Reset Map
                </Button>
                <Button variant="contained" color="info" onClick={handleStartMap}>
                    Start Generation
                </Button>
                <Button variant="contained" color="success" onClick={handleGenerateNextCell} disabled={queueLength === 0}>
                    Generate Next Cell ({queueLength})
                </Button>
                <Button variant="contained" color="primary" onClick={handleGenerateMap}>
                    Generate Map Instantly
                </Button>
                <Button variant="contained" color="warning" onClick={handleFindPath}>
                    Find Path (Start → Last Cell)
                </Button>
                {/* NEW */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTogglePath}
                    disabled={!path}
                >
                    {showPath ? "Hide Path" : "Show Path"}
                </Button>
            </Box>

            {pathSearched && (
                <Typography variant="body2" sx={{ color: path ? "#aaa" : "#f44336" }}>
                    {path ? `Path length: ${path.length} cell${path.length === 1 ? "" : "s"}` : "No path found"}
                </Typography>
            )}
        </Box>
    );
}

export default ProceduralGenTest;