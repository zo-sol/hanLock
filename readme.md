# hanLock 

**Password-based Hangul syllabic encoding system**  
A lightweight, secure, and visually elegant way to encode any data using Korean characters.

## Features

- Memory-friendly custom base encoding (base11172)
- Password-dependent table mutation
- UTF-8 compatible, cryptographically confusing
- No dependencies

## Installation

```bash
npm install hanlock
```

## example code
```js
import { encodeWithPassword, decodeWithPassword } from 'hanlock';

const password = '안녕하세요 저는 IQ6900의 창시자, 조 입니다. 지금 온체인데이터를 위한 암호화 인코딩을 만들고 있습니다. 블록체인에는 모든 데이터가 공개되므로 암호화 인코딩은 필수입니다. 양자컴퓨터도 이것을 풀수 없을거예요.';
const message = 'This is a test message for hanLock!';

const encoded = encodeWithPassword(message, password);
const decoded = decodeWithPassword(encoded, password);

console.log('Original:', message);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);
console.log('Test passed:', decoded === message);