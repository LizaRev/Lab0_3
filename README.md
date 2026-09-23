# Lab 03 - Асинхронний JavaScript: Promises, async/await і екран завантаження

## Головоломки порядку виконання

### 1. `await` під час завантаження ресурсів

**Код:**

```js
async function loadGame() {
    console.log("1. Початок");

    const manifest = await loadJson("./assets/manifest.json");

    console.log("2. Manifest завантажено");

    const assets = await loadAll(manifest);

    console.log("3. Ресурси завантажено");
}

console.log("4. Запуск");
loadGame();
console.log("5. Після запуску");
```

**Вивід:**

```text
4. Запуск
1. Початок
5. Після запуску
2. Manifest завантажено
3. Ресурси завантажено
```

 `await` призупиняє продовження `async`-функції до завершення Promise, але не блокує виконання іншого JavaScript-коду.

---

### 2. `setTimeout` всередині `.then()`

**Код:**

```js
console.log("1. Початок завантаження");

Promise.resolve("assets")
    .then((result) => {
        console.log("2. Завантаження завершено:", result);

        setTimeout(() => {
            console.log("4. Таймер після завантаження");
        }, 0);
    })
    .then(() => {
        console.log("3. Наступний then");
    });

console.log("5. Кінець синхронного коду");
```

**Вивід:**

```text
1. Початок завантаження
5. Кінець синхронного коду
2. Завантаження завершено: assets
3. Наступний then
4. Таймер після завантаження
```

`.then()` виконується як microtask, а `setTimeout()` додає callback до черги macrotask, тому таймер виконується після завершення microtask-ів.

---

### 3. `requestAnimationFrame` в ігровому циклі

**Код:**

```js
console.log("1. Початок кадру");

requestAnimationFrame(() => {
    console.log("4. Наступний кадр гри");
});

Promise.resolve().then(() => {
    console.log("3. Microtask");
});

console.log("2. Синхронний код");
```

**Вивід:**

```text
1. Початок кадру
2. Синхронний код
3. Microtask
4. Наступний кадр гри
```

 синхронний код виконується першим, потім microtask, а callback `requestAnimationFrame` виконується під час наступного кадру браузера.

---

### 4. Promise під час завантаження ассета

**Код:**

```js
console.log("1. Запит ресурсу");

const assetPromise = Promise.resolve("ship.png");

assetPromise.then((asset) => {
    console.log("3. Отримано ресурс:", asset);
});

console.log("2. Очікування ресурсу");
```

**Вивід:**

```text
1. Запит ресурсу
2. Очікування ресурсу
3. Отримано ресурс: ship.png
```

callback `.then()` не виконується одразу, а потрапляє до черги microtask після завершення синхронного коду.

---

### 5. Комбінація Promise, таймера та кадру гри

**Код:**

```js
console.log("1. Старт");

Promise.resolve().then(() => {
    console.log("3. Promise");

    setTimeout(() => {
        console.log("5. Таймер");
    }, 0);
});

requestAnimationFrame(() => {
    console.log("6. Кадр гри");
});

console.log("2. Синхронний код");

queueMicrotask(() => {
    console.log("4. Microtask");
});
```

**Вивід:**

```text
1. Старт
2. Синхронний код
3. Promise
4. Microtask
5. Таймер
6. Кадр гри
```

спочатку виконується синхронний код, потім microtask-и, після них таймер і callback наступного кадру браузера.


