import React, {Component} from 'react';
import "./styles.css";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import Swal from "sweetalert2";

class Arbol {

    constructor(string) {    // Construye a partir de un string ingresado
        let pila = [];
        let x = new NodoArbol(null);
        this._raiz = x;
        let ultimo = x;
        let anclajeContinuacion;
        let longitud = string.length;
        let i = 1

        while (i < longitud - 1) {
            let elemento = string.substring(i, i + 1);
            let atomo = /\w/    //Es miembro del alfabeto latino(REGEX)
            if (atomo.test(elemento)) {
                ultimo.sw = 0;
                ultimo.dato = elemento;
            }
            switch (elemento) {
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
                default:
                    break;
            }
            i++;
        }
    }

    get raiz() {
        return this._raiz;
    }

    toString() {
        let returnedString = "(";
        let p = this.raiz;
        let q = [];     //Pila con las direcciones para continuar.
        let coma = false;
        let parentesisalfinal = 0;
        while (p != null || q.length !== 0 || parentesisalfinal > 0) {

            if (p == null) {     //Cuando termina de recorrer la sublista, reasigna p y continua el recorrido.
                returnedString = returnedString.concat(")");
                p = q.pop();

                while (parentesisalfinal > 0) {    //Parentesis que cierran la sublista
                    returnedString = returnedString.concat(")");
                    parentesisalfinal--;
                }

            }
            if (p !== undefined) {
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
        if (p === null && q.length === 0 && parentesisalfinal === 0) {
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

    altura() {
        let p = this.raiz;
        let maximoNivel = 1;
        let q = [];
        let nivel = 1;

        while (p != null || q.length !== 0) {

            if (p == null) {
                p = q.pop();    //Nodo para continuar el recorrido.
                nivel--;    //Al salir de la sublista, el nivel disminuye en uno por cada sublista de la que salgo.
            }

            if (p !== undefined) {
                if (p.sw === 1) {
                    nivel++;
                    if (p.liga != null) {   //Guarda en la pila si la liga apunta hacia un nodo.
                        q.push(p.liga);
                    }
                    p = p.dato;
                } else {
                    p = p.liga;
                }
            }

            if (maximoNivel < nivel) {
                maximoNivel = nivel;    //Compara los niveles, guarda el mayor.
            }
        }
        return maximoNivel;
    }

    grado() {
        let p = this.raiz;
        let q = [];
        let gradoArbol = 0;
        let gradoNodo = 0;
        while (p != null || q.length !== 0) {

            if (p !== undefined) {

                if (p.sw === 1) {
                    q.push(p.dato); //Primer nodo de la sublista.
                } else {
                    gradoNodo++;    //Salta el nodo de la sublista y continua contando.
                }
                p = p.liga;
            }

            if (p == null) {
                if (gradoNodo > gradoArbol) {
                    gradoArbol = gradoNodo; //Asigna el mayor grado
                }
                p = q.pop();    //Se ubica en el primer nodo de la sublista
                gradoNodo = 0;  //Vuelve a iniciar el conteo
            }
        }
        return gradoArbol;
    }

    nivelRegistro(dato) {
        let p = this.raiz;
        let q = [];
        let nivel = 1;
        let nivelesSaltados = 0;
        while (p != null || q.length !== 0) {
            if (p == null) {
                p = q.pop();
                nivel = nivel - nivelesSaltados - 1;    /*Actualiza el nivel al salir de la sublista
                en la pila solo se guarda si la liga es hacia otro nodo, por lo tanto para mantener el nivel usamos una variable con la cantidad de niveles
                a la que no se podrá acceder después.*/
                nivelesSaltados = 0;
            }
            if (p !== undefined) {
                if (p.sw === 0) {
                    if (dato === p.dato) {  //Encuentra el dato, retorna nivel.
                        return nivel;
                    } else {
                        p = p.liga;
                        continue;
                    }
                }
                if (p.sw === 1) {
                    nivel++;
                    if (p.liga != null) {
                        q.push(p.liga);
                    } else {
                        if (p !== this.raiz.liga) {   //Se usa para ignorar el nivel "saltado" al inicio de la sublista de los hijos de la raiz.
                            nivelesSaltados++;
                        }
                    }
                    p = p.dato; //Ingresa a la sublista.
                }
            }
        }
    }

    numeroHojas() {
        let hojas = 0;
        let p = this.raiz;
        let q = [];
        while (p != null || q.length !== 0) {

            if (p == null) {
                p = q.pop();
            }

            if (p !== undefined) {
                let siguiente = p.liga;
                if (p.sw === 0) {
                    if (siguiente == null) {
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

    buscarNodo(dato) {
        let p = this.raiz;
        let q = [];
        while (p != null || q.length !== 0) {
            if (p == null) {
                p = q.pop();
            }
            if (p !== undefined) {
                if (p.sw === 0) {
                    if (p.dato === dato) {
                        return p;
                    } else {
                        p = p.liga;
                    }
                } else {
                    if (p.liga != null) {
                        q.push(p.liga);
                    }
                    p = p.dato;
                }
            }
        }
        if (p == null) {
            //TODO:Manejo de excepciones
            Swal.fire({
                title: "<span style='color:white'>" + "Error!" + "</span>",
                html: "<span style='color:white; z-index:1400'>" + "El nodo no está en el árbol" + "</span>",
                icon: 'error',
                background: '#2c2d31',
                confirmButtonText: 'Ok',
                confirmButtonColor: "#0f4198",
            });
        }
        return p;
    }

    gradoNodo(dato) {
        let p = this.buscarNodo(dato);
        if(p!== null){
            debugger
            let hijosP = p.liga;
            let gradoNodo = 0;

            if (hijosP == null) {
                return gradoNodo;
            } else if (hijosP.sw === 1) {
                hijosP = hijosP.dato;
                while (hijosP != null) {
                    if (hijosP.sw === 0) {
                        gradoNodo++;
                    }
                    hijosP = hijosP.liga;
                }
                return gradoNodo;
            } else {
                return gradoNodo;
            }
        }
    }

    ancestrosRegistro(dato) {
        let p = this.raiz;
        let anterior = null;
        let q = [];
        let ancestros = [];
        let finesdeLista = 0;

        while (p != null || q.length !== 0) {
            if(p == null){
                p = q.pop();
                ancestros.pop();
                while(finesdeLista > 0){
                    ancestros.pop();
                    finesdeLista--;
                }
            }

            if (p !== undefined) {
                if (p.sw === 0) {
                    if(p.dato === dato){
                        return ancestros.reverse();
                    }
                    anterior = p;
                    p = p.liga;

                }else if (p.sw === 1) {
                    ancestros.push(anterior);   //El padre de la sublista.
                    if (p.liga != null) {
                        q.push(p.liga);
                    }else if(p!==this.raiz.liga){
                        finesdeLista++; /*Para sincronizar ambas pilas, cuando no puedo guardar la liga de la sublista,
                                        debo devolverme una vez más de lo normal en la lista de ancestros para mantener la cadena de ancestros */
                    }
                    p = p.dato;
                }
            }
        }
    }   //Se retornan de mayor a menor cercanía con el registro.
}

class NodoArbol{

    constructor(dato) {
        this._dato = dato
        this._sw = null
        this._liga = null
    }

    toString(){
        return this.dato;
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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arbol: "",
            altura: 0,
            gradoRegistro: "",
            numeroHojas: 0,
            gradoArbol: 0,
            ancestroRegistro: "",
            nivelRegistro: "",
            resultGradeLog: "",
            resultLevelLog: "",
            resultAncestorLog: "",
            displayResultTree: "none",
            displayResultGradeLog: "none",
            displayResultLevelLog: "none",
            displayResultAncesterLog: "none",
        };
    }

    async componentDidMount(){

    }

    handleChangeTextField = e => {
        e.preventDefault();
        this.setState({ arbol: e.target.value });
    }

    handleChangeTextFieldGradeLog = e => {
        e.preventDefault();
        this.setState({ gradoRegistro: e.target.value });
    }

    handleChangeTextFieldLevelLog = e => {
        e.preventDefault();
        this.setState({ nivelRegistro: e.target.value });
    }

    handleChangeTextFieldAncestorLog = e => {
        e.preventDefault();
        this.setState({ ancestroRegistro: e.target.value });
    }

    validFields = (tree) => {
        let valid = !( tree === "" )

        if (!valid) {
            Swal.fire({
                title: "<span style='color:white'>" + "Error!" + "</span>",
                html: "<span style='color:white; z-index:1400'>" + "Por favor ingrese el valor del campo" + "</span>",
                icon: 'error',
                background: '#2c2d31',
                confirmButtonText: 'Ok',
                confirmButtonColor: "#0f4198",
            });
            return valid;
        }

        return (valid);
    }

    handleCreateTree = async (e) => {
        e.preventDefault();
        if (this.validFields(this.state.arbol)) {
            let resultTree = new Arbol(this.state.arbol);
            this.setState({
                displayResultTree: "block",
                altura: resultTree.altura(),
                gradoArbol: resultTree.grado(),
                numeroHojas: resultTree.numeroHojas(),
            });
        }
    }

    handleGradeLog = async (e) => {
        e.preventDefault();
        if (this.validFields(this.state.gradoRegistro)) {
            let resultTree = new Arbol(this.state.arbol);
            let gradoNodo = resultTree.gradoNodo(this.state.gradoRegistro);
                this.setState({
                    resultGradeLog: gradoNodo,
                    displayResultGradeLog: "block",
                });
        }
    }

    handleLevelLog = async (e) => {
        e.preventDefault();
        if (this.validFields(this.state.nivelRegistro)) {
            let resultTree = new Arbol(this.state.arbol);
            let gradoRegistro = resultTree.nivelRegistro(this.state.nivelRegistro);
            if(gradoRegistro){
                this.setState({
                    resultLevelLog: gradoRegistro,
                    displayResultLevelLog: "block",
                });
            } else{
                this.setState({
                    resultLevelLog: "",
                    displayResultLevelLog: "none",
                });
                Swal.fire({
                    title: "<span style='color:white'>" + "Error!" + "</span>",
                    html: "<span style='color:white; z-index:1400'>" + "El nodo no está en el árbol" + "</span>",
                    icon: 'error',
                    background: '#2c2d31',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: "#0f4198",
                });
            }
        }
    }

    handleAncestorLog = async (e) => {
        e.preventDefault();
        if (this.validFields(this.state.ancestroRegistro)) {
            let resultTree = new Arbol(this.state.arbol);
            let ancenstroRegistro = resultTree.ancestrosRegistro(this.state.ancestroRegistro);
            if(ancenstroRegistro){
                if (ancenstroRegistro.length !== 0){
                    this.setState({
                        resultAncestorLog: ancenstroRegistro.join(),
                        displayResultAncesterLog: "block",
                    });
                } else{
                    this.setState({
                        resultAncestorLog: 0,
                        displayResultAncesterLog: "block",
                    });
                }

            } else{
                this.setState({
                    resultAncestorLog: "",
                    displayResultAncesterLog: "none",
                });
                Swal.fire({
                    title: "<span style='color:white'>" + "Error!" + "</span>",
                    html: "<span style='color:white; z-index:1400'>" + "El nodo no está en el árbol" + "</span>",
                    icon: 'error',
                    background: '#2c2d31',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: "#0f4198",
                });
            }
        }
    }

    render() {
        return (
            <div className={"form-register"}>
                <Grid container spacing={2} >
                    <Grid item sm={12} xs={12} >
                        <Typography id={"title"}>Árboles n-arios</Typography>
                    </Grid>
                    <Grid item sm={12} xs={12} >
                        <TextField
                            type="text"
                            fullWidth
                            label="Ingrese el arbol*"
                            variant="outlined"
                            InputProps={{ maxLength: 50, className: "controls" }}
                            InputLabelProps={{
                                className: "colorWhite",
                            }}
                            value={this.state.arbol}
                            onChange={this.handleChangeTextField}
                        />
                        <Typography variant={"subtitle2"}> Por favor ingrese un arbol con este formato (a(b(e,d),c(i(o)),h,u(r(y),t),w))</Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <Button
                            styled={{marginTop: 100}}
                            color={"primary"}
                            fullWidth
                            variant="contained"
                            onClick={this.handleCreateTree}
                        > "Crear"
                        </Button>
                    </Grid>
                </Grid>
                <div className={"result"} style={{display: this.state.displayResultTree}}>
                    <Grid container spacing={2}>
                        <Grid item sm={12} xs={12} >
                            <Typography variant={"h6"}>Resultados del Árbol</Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="El arbol que ingreso es: "
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.arbol}
                                disabled
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="Su altura del arbol es: "
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.altura}
                                disabled
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="Su grado de un arbol es: "
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.gradoArbol}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="El numero de hojas del arbol es: "
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.numeroHojas}
                            />
                        </Grid>
                        <Grid item sm={9} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="Por favor ingrese el dato para calcular el grado de un registro"
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.gradoRegistro}
                                onChange={this.handleChangeTextFieldGradeLog}
                            />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <Button
                                color={"primary"}
                                fullWidth
                                variant="contained"
                                onClick={this.handleGradeLog}
                            > "Enviar"
                            </Button>
                        </Grid>
                        <Grid item sm={12} xs={12} style={{display: this.state.displayResultGradeLog}}>
                            <Typography variant={"subtitle2"}>El grado de su registro es: {this.state.resultGradeLog}</Typography>
                        </Grid>
                        <Grid item sm={9} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="Por favor ingrese el dato para calcular el nivel en el cual se halla un registro"
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.nivelRegistro}
                                onChange={this.handleChangeTextFieldLevelLog}
                            />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <Button
                                color={"primary"}
                                fullWidth
                                variant="contained"
                                onClick={this.handleLevelLog}
                            > "Enviar"
                            </Button>
                        </Grid>
                        <Grid item sm={12} xs={12} style={{display: this.state.displayResultLevelLog}}>
                            <Typography variant={"subtitle2"}>El nivel de su registro es: {this.state.resultLevelLog}</Typography>
                        </Grid>
                        <Grid item sm={9} xs={12}>
                            <TextField
                                type="text"
                                fullWidth
                                label="Por favor ingrese el dato para calcular sus ancestros"
                                variant="outlined"
                                InputProps={{ maxLength: 50, className: "controls" }}
                                InputLabelProps={{
                                    className: "colorWhite",
                                }}
                                value={this.state.ancestroRegistro}
                                onChange={this.handleChangeTextFieldAncestorLog}
                            />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <Button
                                color={"primary"}
                                fullWidth
                                variant="contained"
                                onClick={this.handleAncestorLog}
                            > "Enviar"
                            </Button>
                        </Grid>
                        <Grid item sm={12} xs={12} style={{display: this.state.displayResultAncesterLog}}>
                            <Typography variant={"subtitle2"}>Los ancentros del registro son: {this.state.resultAncestorLog}</Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default App;