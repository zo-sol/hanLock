// hanLock.ts

const BASE_HANGUL_TABLE: string[] = Array.from({ length: 11172 }, (_, i) => String.fromCharCode(0xac00 + i));

function isHangulSyllable(ch: string): boolean {
    const code = ch.charCodeAt(0);
    return code >= 0xac00 && code <= 0xd7a3;
}

export function makePushbackBase(password: string): string[] {
    const table = [...BASE_HANGUL_TABLE];
    for (const char of password) {
        if (!isHangulSyllable(char)) continue;
        const index = table.indexOf(char);
        if (index !== -1) {
            table.splice(index, 1);
            table.push(char);
        }
    }
    return table;
}

export function encodeBaseCustom(num: bigint, baseTable: string[]): string {
    const base = BigInt(baseTable.length);
    if (num === 0n) return baseTable[0];

    const result: string[] = [];
    while (num > 0) {
        const digit = num % base;
        result.push(baseTable[Number(digit)]);
        num = num / base;
    }
    return result.reverse().join('');
}

export function decodeBaseCustom(encoded: string, baseTable: string[]): bigint {
    const base = BigInt(baseTable.length);
    const baseMap = new Map<string, bigint>(baseTable.map((char, idx) => [char, BigInt(idx)]));
    let num = 0n;
    for (const ch of encoded) {
        const digit = baseMap.get(ch);
        if (digit === undefined) throw new Error(`Invalid character: ${ch}`);
        num = num * base + digit;
    }
    return num;
}

export function encodeWithPassword(data: string | Uint8Array, password: string): string {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const num = BigInt('0x' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join(''));
    const baseTable = makePushbackBase(password);
    return encodeBaseCustom(num, baseTable);
}

export function decodeWithPassword(hangulStr: string, password: string): string {
    const baseTable = makePushbackBase(password);
    const num = decodeBaseCustom(hangulStr, baseTable);
    let hex = num.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const byteArray = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return new TextDecoder().decode(byteArray);
}