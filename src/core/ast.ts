import {Expression, ModuleItem, parse, StringLiteral, TemplateElement, TemplateLiteral} from "@swc/core";
import Visitor from "@swc/core/Visitor";

/**
 * Traverses an AST (or parts of it) to collect all StringLiterals and TemplateElements that contain
 * needle in their value.
 */
export class StringCollector extends Visitor {

    public baseStringLiterals: StringLiteral[] = [];
    public baseTemplateElements: TemplateElement[] = [];
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

    visitTemplateLiteral(n: TemplateLiteral): Expression {
        for(const q of n.quasis) {
            if (q.raw.indexOf(this.needle) !== 1) {
                this.baseTemplateElements.push(q);
            }
        }

        return super.visitTemplateLiteral(n);
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
 * Returns an array of StringLiterals and TemplateElements from an AST that contain needle in their value.
 * @param needle
 * @param ast
 */
export function collectMatchingStrings(needle: string, ast: ModuleItem[]): (StringLiteral|TemplateElement)[] {
    const visitor = new StringCollector(needle);
    visitor.visitModuleItems(ast);

    return [ ...visitor.baseStringLiterals, ...visitor.baseTemplateElements ];
}
