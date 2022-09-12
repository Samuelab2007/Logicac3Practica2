# Logicac3Practica2
**Práctica acerca de ÁRBOLES N-ARIOS, implementación de los métodos básicos.**


**Entrada de datos:** A través de string, las convenciones son las siguientes.
El String está contenido entre paréntesis izquierdo y derecho ().
<br>"a": Caracter del alfabeto latino, incluye numeros y letras.
<br>",": Los elementos antes y después del símbolo son hermanos entre sí en el árbol, están en el mismo nivel y comparten padre.
<br>"(": El elemento a la izquierda es el padre, los de la izquierda(pueden ser varios) son sus hijos. **Sólo puede estar acompañado a ambos lados de elementos de tipo "a"**
<br>")": Sirve para cerrar los conjuntos de elementos.

Ejemplo: "(a(b(c,d),f(g),h))"
<br>"a" es la raíz.
<br>"b, f, h" son hijos de "a", hermanos entre sí.
<br>"c, d" son hijos de "b", hermanos entre sí.
<br>"g" es hijo de "f".

# Cómo ejecutar el proyecto en react

Primero ejecuta:
### `npm i`

Cuando termine de instalar todas las dependencias, abres el proyecto con el comando:

### `npm start`

La aplicacion se correra en el puerto 3030
<br>Abre [http://localhost:3000](http://localhost:3000) para verlo en su navegador.
