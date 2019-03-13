import * as format from 'date-fns/format';
import * as addHours from 'date-fns/add_hours';
import * as addDays from 'date-fns/add_days';
import * as startOfDay from 'date-fns/start_of_day';
import * as startOfHour from 'date-fns/start_of_hour';
const moment = extendMoment(moment2);
import * as moment2 from 'moment';
import { extendMoment } from 'moment-range';
import { Observable, Subject } from 'rxjs/Rx';

import * as asyncWhile from 'async-while'

export function tournoiCreate(ds) {

    interface QueryOption {
        select?: string;
        filter?: string;
        params?: string[];
        pageSize?: number;
        start?: number;
        orderBy?: string;
        method?: string;
        emMethod?: string;
    }

    //var horairesToDelete = ds.Horaire.query("typeEvent=='match'").remove()
    const colors = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        blue: {
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        },
        green: {
            primary: '#62f442',
            secondary: '#62f442'
        }
    };

    // enlever les horaires de type match pour réinitialiser l'algorithme
    //var horairesToDelete = ds.Horaire.query("typeEvent=='match'").remove()
    //variables pour tournoi
    var lengthTournoi, counterTournoi, monTournoi, dateTournoi, jourTournoi
    //variables pour catégorie
    var lengthCategorie, counterCategorie = 0, depth, joueurstoAvance, joueursFirstTour, joueursTourComplet, joueursTourSeul, nodeCategorieFirstTour, nodeCategorieCompletTour, nodeCategorieSeulTour
    //variables pour joueurs
    var lengthJoueur = 1, counterJoueur = 0, joueurs, joueur1, joueur2, joueursNb = 0, joueursEnPlace, joueursTentative
    //variables pour match
    var lengthMatch, counterMatch = 0, lengthMatchFirstTour, counterMatchFirstTour, lengthMatchCompletTour, counterMatchCompletTour, counterMatchSeulTour, lengthMatchSeulTour, durationMatch
    //variables pour days
    var lengthDay, counterDay, dayArray
    //variables pour horaires
    var counterHoraire, rangeHoraire, changeHoraireNotComplied
    //variables pour terrains
    var terrains, terrain, counterTerrain, lengthTerrain, changeDayNotComplied
    var condition1 = () => {
        return (joueursNb == 27 || counterJoueur < 5);
    }
    var action1 = () => {
        return doSomethingAsync();
    }
    var myWhile = asyncWhile(condition1, action1);

    var doSomethingAsync = () => {
        counterMatch=0
        counterJoueur++
        
        return ds.Tournoi.query(
            {
                filter: "nom='tournoi des Familles Heusy", select: "ID,nom,horaireCollection:5"
            }
        ).then(
            collection => {
                
                var condition2 = collection => {
                    
                    return (joueursNb == 27 || counterMatch < 4);
                }
                var action2 = collection => {
                    
                    return doSomethingAsync2(collection);
                }
                var myWhile2 = asyncWhile(condition2, action2);
                var doSomethingAsync2 = collection => {
                    
                    counterMatch++
                    return collection
                }
                return myWhile2(collection,collection).then(function (result) {
                                        return result
                }
                )
            }
        )
    }
    myWhile().then(function (result) {
        
    })
    var joueursPrepareSync = (joueurs) => {

        joueursNb = lengthJoueur = joueurs.entities.length
        joueursEnPlace = []
        var depthSearch = (joueursNb) => {
            let depth = 0
            while (2 ** depth <= joueursNb) {
                depth++
            }
            //on retourne la dernière profondeur complète
            return depth - 1
        }
        depth = depthSearch(joueursNb)
        // détermine nombre de joueurs à avancer dans le tournoi
        joueurstoAvance = 2 * (joueursNb - 2 ** depth)
        joueursFirstTour = joueurstoAvance
        joueursTourComplet = 2 ** depth - joueurstoAvance
        joueursTourSeul = joueurstoAvance / 2
        return joueurs.entities
    }

    function joueursPrepareAsync() {
        return Observable.fromPromise(ds.Joueur.query(
            { pageSize: 100, select: "ID,nom,horaireCollection:5" })
        )
    }
    function tournoiPrepareAsync() {
        return Observable.fromPromise(ds.Tournoi.query(
            { filter: "nom='tournoi des Familles Heusy", select: "ID,nom,horaireCollection:5" })
        )
    }
    var tournoiPrepareSync = (tournoi) => {
        monTournoi = tournoi.entities[0]
        //on va commencer par créer les matchs en avance le premier jour
        dateTournoi = moment(monTournoi['dateDebut'])
        jourTournoi = dateTournoi.day()
        return monTournoi
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //c'est ici que commence la routine main
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // var monTournoiObs = tournoiPrepareAsync()
    // monTournoiObs.subscribe(res => {

    //     monTournoi = tournoiPrepareSync(res)
    //     categoriePrepareSync()
    //     dayPrepareSync()
    //     horairePrepareSync()

    //     var WhileCategorie = asyncWhile(() => counterCategorie < 1, actCategorie);
    //     var actCategorie = () => {
    //         return doCategorieAsync();
    //     }
    //     var doCategorieAsync = () => {

    //         counterCategorie++
    //         matchPrepareSync()
    //         var joueursObs = joueursPrepareAsync()
    //         var terrainsObs = terrainsPrepareAsync()
    //         Observable.fromPromise(Promise.all([joueursObs, terrainsObs])).subscribe(
    //             ([joueursObs, terrainsObs]) => {

    //                 var initTrue = false
    //                 while (!joueursEnPlaceBool() && !isChangeComplied()) {
    //                     //on initialise ou procède à un nouveau changement
    //                     initTrue ? change() : init()
    //                     initTrue = true
    //                     //déterminons d'abord les matchs du premier tour
    //                     var matchFirstTour = true
    //                     var matchCompletTour = true
    //                     var matchSeulTour = true

    //                     while (counterMatchFirstTour < lengthMatchFirstTour && matchFirstTour) {
    //                         initWhile()
    //                         //déterminons si le terrain est libre, il faut qu'une période terrainHoraires inclue à la fois start et end
    //                         terrain = classNameFind(terrains, "Terrain", rangeHoraire);
    //                         if (terrain !== undefined) {
    //                             joueur1 = classNameFind(joueurs, "Joueur", rangeHoraire)
    //                             if (joueur1 !== undefined) {
    //                                 joueur2 = classNameFind(joueurs, "Joueur", rangeHoraire, joueur1)
    //                                 if (joueur2 !== undefined) {
    //                                     counterMatchFirstTour++
    //                                     let np1 = joueur1.prenom + ' ' + joueur1.nom
    //                                     let np2 = joueur2.prenom + ' ' + joueur2.nom
    //                                     adaptDispo(joueur1, np2, np1);
    //                                     adaptDispo(joueur2, np2, np1);
    //                                     adaptDispo(terrain, np2, np1);
    //                                     //on pousse dans l'arbre du tournoi le noeud firstTour suivant
    //                                     nodeCategorieFirstTour.push({ "type": "match", "joueur1": np1, "joueur2": np2, "score": "", "children": [] })
    //                                     //on pousse les ID des joueurs 
    //                                     joueursEnPlace.push(joueurs.indexOf(joueur1), joueurs.indexOf(joueur2))
    //                                 }
    //                                 else { matchFirstTour = false }
    //                             }
    //                             else { matchFirstTour = false }
    //                         }
    //                         else {
    //                             matchFirstTour = false
    //                         }
    //                     }
    //                     //on peut déjà faire se disputer les matchs à deux joueurs du tours complet
    //                     while (counterMatchCompletTour < lengthMatchCompletTour && matchCompletTour) {
    //                         initWhile()
    //                         //déterminons si le terrain est libre, il faut qu'une période terrainHoraires inclue à la fois start et end
    //                         terrain = classNameFind(terrains, "Terrain", rangeHoraire);
    //                         if (terrain !== undefined) {
    //                             joueur1 = classNameFind(joueurs, "Joueur", rangeHoraire)
    //                             if (joueur1 !== undefined) {
    //                                 joueur2 = classNameFind(joueurs, "Joueur", rangeHoraire, joueur1)
    //                                 if (joueur2 !== undefined) {
    //                                     counterMatchCompletTour++
    //                                     let np1 = joueur1.prenom + ' ' + joueur1.nom
    //                                     let np2 = joueur2.prenom + ' ' + joueur2.nom
    //                                     adaptDispo(joueur1, np2, np1);
    //                                     adaptDispo(joueur2, np2, np1);
    //                                     adaptDispo(terrain, np2, np1);
    //                                     //on pousse dans l'arbre du tournoi le noeud completTour suivant
    //                                     nodeCategorieCompletTour.push({ "type": "match", "joueur1": np1, "joueur2": np2, "score": "", "children": [] })
    //                                     //on peut déjà préparer le match du tour complet correspondant
    //                                     //on pousse les ID des joueurs 
    //                                     joueursEnPlace.push(joueurs.indexOf(joueur1), joueurs.indexOf(joueur2))
    //                                 }
    //                                 else { matchCompletTour = false }
    //                             }
    //                             else { matchCompletTour = false }
    //                         }
    //                         else {
    //                             matchCompletTour = false
    //                         }
    //                     }
    //                     while (counterMatchSeulTour < lengthMatchSeulTour && matchSeulTour) {
    //                         initWhile()
    //                         //déterminons si le terrain est libre, il faut qu'une période terrainHoraires inclue à la fois start et end
    //                         terrain = classNameFind(terrains, "Terrain", rangeHoraire);
    //                         if (terrain !== undefined) {
    //                             joueur2 = classNameFind(joueurs, "Joueur", rangeHoraire)
    //                             if (joueur2 !== undefined) {
    //                                 counterMatchSeulTour++
    //                                 let np2 = joueur2.prenom + ' ' + joueur2.nom
    //                                 adaptDispo(joueur2, np2);
    //                                 adaptDispo(terrain, np2);
    //                                 //on pousse dans l'arbre du tournoi le noeud completTour suivant
    //                                 nodeCategorieSeulTour.push({ "type": "match", "joueur1": "", "joueur2": np2, "score": "", "children": [] })
    //                                 //on peut déjà préparer le match du tour complet correspondant
    //                                 //on pousse les ID des joueurs 
    //                                 joueursEnPlace.push(joueurs.indexOf(joueur2))
    //                             }
    //                             else { matchSeulTour = false }
    //                         }
    //                         else {
    //                             matchSeulTour = false
    //                         }
    //                     }
    //                 }
    //                 counterCategorie++
    //             })

    //         counterTournoi++

    //     }
    //     WhileCategorie().then(function (result) {

    //     });





    // })

    // //c'est ici qu'il serait intéressant de remettre à jour les horaires des joueurs et des terrains dans la base de données
    // joueursAdapt();
    // terrainAdapt()

    // // alternative on enregistre les tableaux nodes
    // let myCategorie = ds.Categorie.first()
    // myCategorie.depth = depth
    // myCategorie.nodeCategorieFirstTour = { "nodeCategorieFirstTour": nodeCategorieFirstTour }
    // myCategorie.nodeCategorieCompletTour = { "nodeCategorieCompletTour": nodeCategorieCompletTour }
    // myCategorie.nodeCategorieSeulTour = { "nodeCategorieSeulTour": nodeCategorieSeulTour }
    // myCategorie.save()



    function joueursAdapt() {
        joueurs.map(joueur => {

            let queryString = "ID==" + "'" + joueur.ID + "'";
            let elem = ds.Joueur.find(queryString);
            let horairesToDelete = elem.horaireCollection;
            horairesToDelete.remove();
            let matchs = joueur.horaireCollection.filter(horaire => horaire.typeEvent == "match");
            matchs.map(match => {
                let matchsEvents = match.event.events;
                var h1 = new ds.Horaire();
                h1.joueur = elem;
                h1.typeEvent = "match";
                h1.event = { events: matchsEvents };
                h1.save();
            })
            let horaires = joueur.horaireCollection.filter(horaire => horaire.typeEvent == "horaire");
            horaires.map(horaire => {
                let horairesEvents = horaire.event.events;
                var h2 = new ds.Horaire();
                h2.joueur = elem;
                h2.typeEvent = "horaire";
                h2.event = { events: horairesEvents };
                h2.save();
            })
        });
    }
    function terrainAdapt() {
        terrains.map(terrain => {
            let queryString = "ID==" + "'" + terrain.ID + "'";
            let elem = ds.Terrain.find(queryString);
            let horairesToDelete = elem.horaireCollection;
            horairesToDelete.remove();
            let matchs = terrain.horaireCollection.filter(horaire => horaire.typeEvent == "match");
            matchs.map(match => {
                let matchsEvents = match.event.events;
                var h1 = new ds.Horaire();
                h1.terrain = elem;
                h1.typeEvent = "match";
                h1.event = { events: matchsEvents };
                h1.save();
            })
            let horaires = terrain.horaireCollection.filter(horaire => horaire.typeEvent == "horaire");
            horaires.map(horaire => {
                let horairesEvents = horaire.event.events;
                var h2 = new ds.Horaire();
                h2.terrain = elem;
                h2.typeEvent = "horaire";
                h2.event = { events: horairesEvents };
                h2.save();
            })
        });
    }
    function adaptDispo(elem, ...args) {
        if (args[1] == undefined) args.push("défini plus tard")
        let horaires = elem.horaireCollection;
        let horaireToDelete = horaires.find(horaire => horaire.typeEvent == "horaire");
        let myEvents = horaireToDelete.event.events;
        myEvents = intersect(myEvents, rangeHoraire)
        let newHoraire = {
            typeEvent: "match",
            event: {
                events: [{
                    start: new Date(rangeHoraire.start),
                    end: new Date(rangeHoraire.end),
                    title: args[0] + " <br> " + args[1],
                    color: colors.red
                }]
            }
        }

        horaires.push(newHoraire)

    }

    function joueursTentativeBool() {
        return (joueursTentative.length <= joueursNb)
    }
    function joueursEnPlaceBool() {
        return (joueursEnPlace.length == joueursNb)
    }
    function isChangeComplied() {
        return (isChangeHoraireComplied() && isChangeDayComplied())
    }
    function isChangeTerrainComplied() {
        let result = (counterTerrain < lengthTerrain)
        return (!result)
    }
    function isChangeHoraireComplied() {
        let counterHoraireTest = counterHoraire + 1
        let rangeHoraireTest = horaireMatchFind(counterHoraireTest)
        //todo danger je ne suis pas sûr que l'index de counterDay soit nécessairement le bon
        let myEvents = monTournoi.horaireCollection.entities[0].event.events
        let result = isIntersect(myEvents, rangeHoraireTest)

        changeHoraireNotComplied = result
        return (!result)
    }
    function isChangeDayComplied() {
        let result = (counterDay < lengthDay)
        changeDayNotComplied = result

        return (!result)
    }
    function change() {
        if (changeHoraireNotComplied) { changeHoraire() }
        else {
            if (changeDayNotComplied) { changeDay() }
            else {
            }
        }
    }
    function init() {
        //terrain
        counterTerrain = 0
        //day
        counterDay = 0
        //horaire
        counterHoraire = 0
        rangeHoraire = horaireMatchFind(counterHoraire)
        //match
        counterMatch = 0
        counterMatchFirstTour = 0
        counterMatchCompletTour = 0
        counterMatchSeulTour = 0
        //joueurs
        joueursTentative = []


    }

    function changeTerrain() {
        counterTerrain++
    }

    function changeHoraire() {
        counterHoraire++
        rangeHoraire = horaireMatchFind(counterHoraire)
    }

    function changeDay() {
        counterHoraire = -1
        counterDay++
    }

    function classNameFind(className, myClassName, range, condition?) {
        let el = className.find(classNameHoraire, { "myClassName": myClassName, "range": range, "condition": condition })
        return el
    }

    function classNameHoraire(el, index, className) {
        let elHoraires = el.horaireCollection;
        //il ne faut pas que le joueur fasse partie des joueurs déjà en place
        if (this.myClassName == "Joueur") {
            if (joueursEnPlace.indexOf(index) !== -1) { return false }
        }
        //il ne faut pas que le joueur ait déjà une partie organisée dans les 24 heures qui précèdent
        // todo ce qui revient au même que de chercher les joueurs qui n'ont pas encore de match organisé
        // todo la problématique des 24 heures et des joueurs qui appartiennent à plusieurs catégories
        if (this.myClassName == "Joueur") {
            let elMatch = elHoraires.find(horaire => horaire.typeEvent == "match");
            if (elMatch !== undefined) { return false }

        }
        //il n'y a pas lieu de resélectionner le joueur que l'on vient de sélectionner
        let index2 = index
        if (typeof this.condition !== "undefined") {
            index2 = className.indexOf(this.condition)
            if (index2 == index) return false
        }

        let elHoraire = elHoraires.find(horaire => horaire.typeEvent == "horaire");
        let myEvents = elHoraire.event.events;
        let eventFind = include(myEvents, this.range);
        return (eventFind);
    }

    function horaireMatchFind(counter) {
        let reste = counter % 2
        let increment
        increment = (reste == 0) ? Math.floor(counter / 2) : Math.floor(counter / 2)
        let heureRef = moment(dayArray[counterDay]).format('LLLL');
        let translationHeureCible = (-1) ** counter * durationMatch * increment
        let heureCible = moment(addHours(new Date(heureRef), translationHeureCible)).format('LLLL');
        let translationHeureEnd = (-1) ** counter * durationMatch;
        let secondHeureCible = moment(addHours(new Date(heureCible), translationHeureEnd)).format('LLLL');
        let start = (secondHeureCible < heureCible) ? secondHeureCible : heureCible;
        let end = (secondHeureCible < heureCible) ? heureCible : secondHeureCible;
        let other = moment.range(moment(start), moment(end));
        return other;
    }



    function categoriePrepareSync() {
        nodeCategorieFirstTour = []
        nodeCategorieCompletTour = []
        nodeCategorieSeulTour = []
        lengthCategorie = 1
        counterCategorie = 0
    }

    function matchPrepareSync() {
        durationMatch = 1
        counterMatch = -1
        counterMatchFirstTour = 0
        counterMatchCompletTour = 0
        counterMatchSeulTour = 0
        //chaque joueur avancé donne lieu à un match,
        //on organise dès à présent les matchs du tour complet
        lengthMatch = joueurstoAvance + joueursTourComplet / 2 //ou 2**(depth-1)
        lengthMatchFirstTour = joueursFirstTour / 2
        lengthMatchCompletTour = joueursTourComplet / 2
        lengthMatchSeulTour = joueursTourSeul
    }

    function dayPrepareSync() {
        counterDay = 0
        dayArray = []

        monTournoi.horaireCollection.entities[0].event.events.map(event => {
            let range = rangeFromEvent(event)
            let horaireMiddle = moment(startOfHour(new Date(range.center()))).format('LLLL')
            dayArray.push(horaireMiddle)
        })
        lengthDay = dayArray.length
    }
    function horairePrepareSync() {
        counterHoraire = 0
    }



    // détermine nombre de tours du tournoi,catégorie

    var terrainsPrepareSync = terrains => {
        terrains => {
            counterTerrain = -1
            //gestion des terrains
            //todo attribution des terrains en fonction des catégories
            //ici on postule que les trois premiers terrains sont pour le tournoi => hardcoding
            terrains = terrains.filter((terrain, index) => index < 3)
            lengthTerrain = terrains.length
            return terrains.entities
        }
    }
    function terrainsPrepareAsync() {
        return terrains = Observable.fromPromise(
            ds.Terrain.query({ pageSize: 100, select: "ID,nom,horaireCollection:5" })
        )
    }

    function rangeFromEvent(event) {
        let start, end, range
        Object.keys(event).map(key => {
            if (key == "start") {
                start = event[key]
            }
            if (key == "end") {
                end = event[key]
            }
        })
        range = moment.range(start, end)
        return range
    }

    function duration(end, start) {
        let duration = new Date(end).getHours() - new Date(start).getHours()
        return duration
    }

    function include(myEvents, other) {
        let eventFind = myEvents.find(event => {
            let start = moment(other.start)
            let end = moment(other.end)
            let rangeEvent = rangeFromEvent(event)
            let isStart = rangeEvent.contains(start)
            let isEnd = rangeEvent.contains(end)
            return (isStart && isEnd)

        })
        return (eventFind !== undefined)
    }

    function intersect(myEvents, other) {
        myEvents.map(event => {
            let _this = rangeFromEvent(event)
            let result = _this.subtract(other)
            //selon result on mergeDeep l'event modifié et on push dans myEvents un nouvel event
            if (result.length !== 0) {
                event = Object.assign(event, {
                    start: moment(result[0].start._d).format('LLLL'),
                    end: moment(result[0].end._d).format('LLLL')
                });
                //on crée une copie de event et on mergeDeep avec result[1]
                if (result.length == 2) {
                    let eventCopy = Object.assign({}, event)
                    eventCopy = Object.assign(eventCopy, {
                        start: moment(result[1].start._d).format('LLLL'),
                        end: moment(result[1].end._d).format('LLLL')
                    });
                    myEvents.push(eventCopy)
                }
            }
        })
        return myEvents
    }
    function isIntersect(myEvents, range) {
        let el = myEvents.find(findIntersect, { range: range })
        let result = (el == undefined) ? false : true
        return result
    }

    function findIntersect(event, index, myEvents) {
        //nous devons trouver un intersect qui retourne un tableau de longueur 2 
        let start = moment(this.range.start)
        let end = moment(this.range.end)
        let rangeEvent = rangeFromEvent(event)
        let isStart = rangeEvent.contains(start, { exclusive: true })
        let isEnd = rangeEvent.contains(end, { exclusive: true })
        return (isStart && isEnd)
    }
    function initWhile() {
        terrain = {}
        joueur1 = {}
        joueur2 = {}
    }
}