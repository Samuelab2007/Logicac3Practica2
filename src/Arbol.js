class Arbol{

    constructor(string){    // Construye a partir de un string ingresado
        let pila = [];
        let x = new NodoArbol(null);
        this._raiz = x;
        let ultimo = x;
        let anclajeContinuacion;
        let longitud = string.length;
        let i = 1

        while(i < longitud-1) {
            let elemento = string.substring(i,i+1);
            let atomo = /\w/    //Es miembro del alfabeto latino(REGEX)
            if(atomo.test(elemento)){
                ultimo.sw = 0;
                ultimo.dato = elemento;
            }
            switch (elemento){
                case ",":   //Crea un nodo vacío y lo ligo
                    x = new NodoArbol(null);
                    ultimo.liga = x;
                    ultimo = x;
                    break;
                case "(":

                    x = new NodoArbol(null);    //Creo un nodo vacio y lo ligo a mi lista
                    ultimo.liga = x;
                    ultimo = x;
                    ultimo.sw = 1;
                    anclajeContinuacion = ultimo;  //Guardo el nodo para continuar luego la lista.

                    pila.push(anclajeContinuacion); //Almaceno en la pila los nodos para continuar al finalizar cada sublista.

                    let y = new NodoArbol(null);
                    ultimo.dato = y;  //Liga al primer nodo de la sublista, el cual se inicializa vacío.
                    ultimo = y;
                    break;
                case ")":
                    ultimo = pila.pop();    //Me ubico para poder continuar la lista.
                    anclajeContinuacion = ultimo;
                    break;
            }
            i++;
        }
    }

    get raiz(){
        return this._raiz;
    }

    toString(){
        let returnedString = "(";
        let p= this.raiz;
        let q = [];     //Pila con las direcciones para continuar.
        let coma = false;
        let parentesisalfinal = 0;
        while(p!=null || q.length!==0 || parentesisalfinal>0){

            if(p==null){     //Cuando termina de recorrer la sublista, reasigna p y continua el recorrido.
                returnedString = returnedString.concat(")");
                p = q.pop();

                while(parentesisalfinal>0){    //Parentesis que cierran la sublista
                    returnedString = returnedString.concat(")");
                    parentesisalfinal--;
                }

            }
            if(p!==undefined) {
                if (Number(p.sw) === 1) {
                    returnedString = returnedString.concat("(");
                    coma = false;
                    if (p.liga != null) {
                        q.push(p.liga);
                    } else if (p !== this._raiz.liga) {
                        parentesisalfinal += 1;
                    }
                    p = p.dato;
                } else {
                    let elemento = p.dato;
                    if (coma === false) {
                        returnedString = returnedString.concat(elemento);
                    } else {
                        returnedString = returnedString.concat(",", elemento);
                    }
                    p = p.liga;
                    coma = true;
                }
            }
        }
        if(p===null && q.length===0 && parentesisalfinal===0){
            returnedString = returnedString.concat(")");
        }
        returnedString = returnedString.concat(")");
        return returnedString;

        /*Para recorrer la lista: Cuando encuentro un nodo sw==1, uso dos apuntadores, uno hacia los datos hijos y el otro hacia la liga del nodo.
        /De esta manera, cuando termine de recorrer la sublista,(apuntador == null) asigno al apuntador el valor del otro,
        /esto se repite hasta la finalización del recorrido(cuando ambos apuntadores == null)
        */

        /*Si encuentro un nodo con sw == 1, escribo un parentesis izquierdo
        /Cada que salga de una sublista(Cuando encuentro una liga == null) escribo un paréntesis derecho.
        /Cuando encuentre elemento: si antes de este existe un nodo con sw==1(si en el string hay un parentesis izquierdo antes)
        /   solo escribo el dato del elemento, en otro caso escribo una coma "," y después el dato del elemento.
        */
    }

    altura(){
        let p = this.raiz;
        let maximoNivel = 1;
        let q = [];
        let nivel = 1;

        while(p!=null || q.length!==0){

            if(p==null){
                p = q.pop();    //Nodo para continuar el recorrido.
                nivel--;    //Al salir de la sublista, el nivel disminuye en uno por cada sublista de la que salgo.
            }

            if(p !== undefined) {
                if (p.sw === 1) {
                    nivel++;
                    if (p.liga != null) {   //Guarda en la pila si la liga apunta hacia un nodo.
                        q.push(p.liga);
                    }
                    p = p.dato;
                }else{
                    p = p.liga;
                }
            }

            if(maximoNivel < nivel){
                maximoNivel = nivel;    //Compara los niveles, guarda el mayor.
            }
        }
        return maximoNivel;
    }

    grado(){
        let p = this.raiz;
        let q = [];
        let gradoArbol = 0;
        let gradoNodo = 0;
        while(p!=null || q.length !== 0){

            if(p !== undefined){

                if(p.sw === 1){
                    q.push(p.dato); //Primer nodo de la sublista.
                }else{
                    gradoNodo++;    //Salta el nodo de la sublista y continua contando.
                }
                p = p.liga;
            }

            if(p==null){
                if(gradoNodo > gradoArbol){
                    gradoArbol = gradoNodo; //Asigna el mayor grado
                }
                p = q.pop();    //Se ubica en el primer nodo de la sublista
                gradoNodo = 0;  //Vuelve a iniciar el conteo
            }
        }
        return gradoArbol;
    }

    nivelRegistro(dato){
        let p = this.raiz;
        let q = [];
        let nivel = 1;
        let nivelesSaltados = 0;
        while(p != null || q.length !== 0){
            if(p==null){
                p = q.pop();
                nivel = nivel - nivelesSaltados - 1;    /*Actualiza el nivel al salir de la sublista
                en la pila solo se guarda si la liga es hacia otro nodo, por lo tanto para mantener el nivel usamos una variable con la cantidad de niveles
                a la que no se podrá acceder después.*/
                nivelesSaltados = 0;
            }
            if(p !== undefined){
                if(p.sw === 0){
                    if (dato === p.dato) {  //Encuentra el dato, retorna nivel.
                        return nivel;
                    }else{
                        p = p.liga;
                        continue;
                    }
                }
                if(p.sw === 1){
                    nivel++;
                    if(p.liga != null){
                        q.push(p.liga);
                    }else{
                        if(p !== this.raiz.liga) {   //Se usa para ignorar el nivel "saltado" al inicio de la sublista de los hijos de la raiz.
                            nivelesSaltados++;
                        }
                    }
                    p = p.dato; //Ingresa a la sublista.
                }
            }
        }
    }

    numeroHojas(){
        let hojas = 0;
        let p = this.raiz;
        let q = [];
        while(p != null || q.length !== 0){

            if(p == null){
                p = q.pop();
            }

            if(p !== undefined) {
                let siguiente = p.liga;
                if (p.sw === 0) {
                    if(siguiente==null){
                        hojas++;
                    } else if (siguiente.sw === 0) { //Cuando el nodo no tiene hijos.
                        hojas++;
                    }
                    p = siguiente;
                } else if (p.sw === 1) {
                    if (siguiente != null) {
                        q.push(siguiente);
                    }
                    p = p.dato;
                }
            }
        }
        return hojas;
    }

    buscarNodo(dato){
        let p = this.raiz;
        let q = [];
        while(p!=null || q.length !== 0){
            if(p==null){
                p = q.pop();
            }
            if(p!==undefined){
                if(p.sw === 0){
                    if(p.dato === dato){
                        return p;
                    }else{
                        p = p.liga;
                    }
                }else{
                    if(p.liga!=null) {
                        q.push(p.liga);
                    }
                    p = p.dato;
                }
            }
        }
        if(p==null){
            alert("El nodo no está en el árbol");   //TODO:Manejo de excepciones
        }
        return p;
    }

    gradoNodo(dato){
         let p = this.buscarNodo(dato);
         let hijosP = p.liga;
         let gradoNodo = 0;

         if(hijosP==null){
             return gradoNodo;
         }else if(hijosP.sw === 1){
             hijosP = hijosP.dato;
             while(hijosP != null){
                 if(hijosP.sw===0){
                     gradoNodo++;
                 }
                 hijosP = hijosP.liga;
             }
             return gradoNodo;
         }else{
             return gradoNodo;
         }

    }
}

class NodoArbol{

    constructor(dato) {
        this._dato = dato
        this._sw = null
        this._liga = null
    }

    // Getters y setters para el nodo
    get sw() {
        return this._sw;
    }

    set sw(value) {
        this._sw = value;
    }

    get dato() {
        return this._dato;
    }

    set dato(value) {
        this._dato = value;
    }

    get liga() {
        return this._liga;
    }

    set liga(value) {
        this._liga = value;
    }
}

arbolprueba = new Arbol("(a(b(e,d),c(i(o)),h,u(r,t(y)),w))");
document.getElementById("testing").innerText = arbolprueba.toString();
document.getElementById("altura").innerText = String(arbolprueba.altura());
document.getElementById("grado").innerText = String(arbolprueba.grado());
document.getElementById("hojas").innerText = String(arbolprueba.numeroHojas());
document.getElementById("gradoNodo").innerText = String(arbolprueba.gradoNodo("c"));
alert("Nivel del registro d es: "+arbolprueba.nivelRegistro("d"));