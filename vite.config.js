"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
