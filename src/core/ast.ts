import {ModuleItem, parse, StringLiteral} from "@swc/core";
import Visitor from "@swc/core/Visitor";

/**
 * Traverses an AST (or parts of it) to collect all StringLiterals that contain
 * needle in their value.
 */
export class StringLiteralCollector extends Visitor {

    public baseStringLiterals: StringLiteral[] = [];
    private readonly needle: string;

    constructor(needle: string) {
        super();
        this.needle = needle;
    }

    visitStringLiteral(n: StringLiteral): StringLiteral {

        if (n.value.indexOf(this.needle) !== -1) {
            this.baseStringLiterals.push(n);
        }

        return super.visitStringLiteral(n);
    }
}

/**
 * Represents a string as bytes, so it can be sliced via
 * byte-positions.
 */
export class StringAsBytes {
    private string: Uint8Array;
    private decoder: TextDecoder;

    constructor(string: string) {
        this.decoder = new TextDecoder();
        this.string = (new TextEncoder()).encode(string);
    }

    /**
     * Returns a slice of the string by providing byte indices.
     * @param from - Byte index to slice from
     * @param to - Optional byte index to slice to
     */
    public slice(from: number, to?: number): string {
        return this.decoder.decode(
            new DataView(this.string.buffer, from, to !== undefined ? to - from : undefined)
        );
    }
}

/**
 * Parses js code into a AST.
 * @param code
 */
export async function parseCode(code: string): Promise<[number, ModuleItem[]]> {
    const module = await parse(code, { target: 'esnext', syntax: 'ecmascript' });
    return [module.span.start, module.body];
}

/**
 * Returns an array of StringLiterals from an AST that contain needle in their value.
 * @param needle
 * @param ast
 */
export function collectMatchingStringLiterals(needle: string, ast: ModuleItem[]): StringLiteral[] {
    const visitor = new StringLiteralCollector(needle);
    visitor.visitModuleItems(ast);

    return visitor.baseStringLiterals;
}
