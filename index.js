const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var rateLimit = require('function-rate-limit');
const requirement = 1.0e-5
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let paths_ = {
    bropath: {
            name: "limfjordsbroen",
            class: 50,
            type: "Bro",
            spand: 30,
            color: "#ffcc33",
            path: [{lat:57.05272529190218, lng:9.917737176668847},{lat:57.05306372385469, lng:9.91805635954162},{lat:57.05367561776083, lng:9.918718205955694},{lat:57.05426836837738, lng:9.919378057667764},{lat:57.05497387331946, lng:9.920146049659246},{lat:57.0556299277329, lng:9.920869682025995},{lat:57.056316531824514, lng:9.921638492076896},{lat:57.05706403241996, lng:9.922431227192247},{lat:57.05709466289421, lng:9.922326621040666},{lat:57.0558358074135, lng:9.920956413417903},{lat:57.05492524059234, lng:9.919964157210103},{lat:57.053941462138795, lng:9.918878477577667},{lat:57.05323843425168, lng:9.918116804227157},{lat:57.05299336429895, lng:9.917867358788772},{lat:57.05276725665803, lng:9.917639371022506}]},
    tunnelpath: {
            name: "limfjordstunnel",
            class: 100,
            type: "Tunnel",
            color: "#008000",
        path: [{lat:57.0534562160397, lng:9.964558263488325},{lat:57.05436645636499, lng:9.962648530669721},{lat:57.05558591003367, lng:9.960309644408735},{lat:57.05661862177167, lng:9.958314080901655},{lat:57.057779658859445, lng:9.956082483001264},{lat:57.05802469722276, lng:9.955567498870405},{lat:57.057913846734934, lng:9.955331464477094},{lat:57.056421038560934, lng:9.958161943770762},{lat:57.05516076960027, lng:9.960597389556284},{lat:57.05444309732675, lng:9.96194922289979},{lat:57.05426228734889, lng:9.962400229337906},{lat:57.053958189182566, lng:9.962887458218788},{lat:57.05371895888467, lng:9.963354162587379},{lat:57.05326383357485, lng:9.964121274365638}]},
    path100: {
        name: "path100",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.04351944317478, lng:9.972355951675596},{lat:57.042494787088614, lng:9.972543706306638},{lat:57.041526025961076, lng:9.97273938040664},{lat:57.04047340637853, lng:9.972852033185266},{lat:57.04025204915175, lng:9.972889584111474},{lat:57.04020535296133, lng:9.972460430669091},{lat:57.041877389886515, lng:9.97225658278396},{lat:57.043118097082484, lng:9.972048616138855},{lat:57.04348938945215, lng:9.971989360470044},{lat:57.04438038049243, lng:9.971758690494763},{lat:57.044240307312506, lng:9.972209301609265},{lat:57.04352081812539, lng:9.972353766888643}]},
    path101: {
        name: "path101",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.040160329689314, lng:9.972904564638574},{lat:57.03819613580524, lng:9.973082498475238},{lat:57.0349968261821, lng:9.973212825027348},{lat:57.03414135947797, lng:9.973218189445378},{lat:57.03346998569182, lng:9.97314845201099},{lat:57.03268475487437, lng:9.973035799232365},{lat:57.031941762066026, lng:9.972828902532273},{lat:57.03101345667806, lng:9.972474850942307},{lat:57.03110641372367, lng:9.972043702402956},{lat:57.03232197508762, lng:9.97257711793614},{lat:57.03307227640033, lng:9.972727321640974},{lat:57.0340668045759, lng:9.972803368215173},{lat:57.03558232226431, lng:9.972755088452905},{lat:57.03691613433195, lng:9.972699021946587},{lat:57.038694096452986, lng:9.97260784801802},{lat:57.04012777647638, lng:9.972475905590676},{lat:57.0401555024044, lng:9.972888965778969}]},
    path102: {
        name: "path102",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.030804734469555, lng:9.972377406254948},{lat:57.029673653264474, lng:9.971801770733938},{lat:57.02867479762234, lng:9.97106121914257},{lat:57.02755042223619, lng:9.970055039914753},{lat:57.026388723388266, lng:9.96875123536551},{lat:57.024986352448266, lng:9.966996486588666},{lat:57.022566966794436, lng:9.964012437778615},{lat:57.022785958591605, lng:9.963706665950918},{lat:57.02370254341456, lng:9.964749265001211},{lat:57.0247154120317, lng:9.966076888693394},{lat:57.02602269521206, lng:9.96773046771906},{lat:57.02764503542427, lng:9.969630607481474},{lat:57.02932047006112, lng:9.971054429729417},{lat:57.03041970149067, lng:9.971719803229155},{lat:57.030898460725716, lng:9.972004117384733},{lat:57.03080139570854, lng:9.972371580019773}]},
    path103: {
        name: "path103",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.02244827359724, lng:9.963861921383108},{lat:57.0200710374052, lng:9.960943511139039},{lat:57.02009708485617, lng:9.96044695775387},{lat:57.02260776062652, lng:9.963599437827696},{lat:57.0224457060439, lng:9.963852906579604}]},
    path104: {
        name: "path104",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.01989122329061, lng:9.96071186868478},{lat:57.01883608415432, lng:9.9593570321985},{lat:57.01818399845813, lng:9.958420110050955},{lat:57.01791937049867, lng:9.957988851955081},{lat:57.018093125815646, lng:9.95776354639783},{lat:57.018745175190695, lng:9.958753281524325},{lat:57.01932091799253, lng:9.959562215128827},{lat:57.019918275654796, lng:9.96023750886032},{lat:57.01989053462548, lng:9.960696166601867}]},
    path105: {
        name: "path105",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.017874294623134, lng:9.957910526994844},{lat:57.01732557071008, lng:9.95695057701042},{lat:57.0169009299834, lng:9.956090611813408},{lat:57.01641497175872, lng:9.954919536287616},{lat:57.01594379388877, lng:9.953583795208472},{lat:57.015424267137014, lng:9.951771551808125},{lat:57.01502366712165, lng:9.94997942761588},{lat:57.01469457338862, lng:9.948062959141723},{lat:57.01439214532283, lng:9.945725703165603},{lat:57.01414615881311, lng:9.943889542760761},{lat:57.01390851919997, lng:9.942094358320341},{lat:57.01359163500145, lng:9.939916404600249},{lat:57.01322889118473, lng:9.937323279924101},{lat:57.01314986198831, lng:9.93656949840342},{lat:57.013359525963914, lng:9.936148831306703},{lat:57.01361128445601, lng:9.938047722658542},{lat:57.01393275826113, lng:9.940439103852649},{lat:57.01424754857509, lng:9.942825601904625},{lat:57.01460619396863, lng:9.945592574713942},{lat:57.01501477999515, lng:9.948574420472092},{lat:57.015443573645236, lng:9.95085349612505},{lat:57.015974472012, lng:9.952782404063427},{lat:57.0166589196765, lng:9.954762923415865},{lat:57.01715306649904, lng:9.956021908417876},{lat:57.017778474133564, lng:9.957257123211964},{lat:57.01800483278953, lng:9.95764738462363},{lat:57.017874881101946, lng:9.95790487668906}]},
    path106: {
        name: "path106",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.01312391765219, lng:9.936443295806248},{lat:57.01285089824812, lng:9.934408550683935},{lat:57.012603055457255, lng:9.93250600090977},{lat:57.012333815881895, lng:9.930335654914927},{lat:57.01207549652647, lng:9.928286991323517},{lat:57.01178109294668, lng:9.926294682195364},{lat:57.0117475043488, lng:9.925817248990713},{lat:57.01197240133875, lng:9.925779698064504},{lat:57.01215907766859, lng:9.927116498650811},{lat:57.01228758897866, lng:9.928133055867455},{lat:57.01250664518592, lng:9.929651602777794},{lat:57.01278615036496, lng:9.931797247607483},{lat:57.01307764265969, lng:9.93403953404445},{lat:57.01334525642757, lng:9.93599614823232},{lat:57.013127669341515, lng:9.936433348301748}]},
    path107: {data: {
        name: "path107",
        class: 100,
        type: "Road",
        color: "#008000",
    },path: [{lat:57.011713774575746, lng:9.92564290707369},{lat:57.011328233365056, lng:9.923684894492819},{lat:57.010732928879634, lng:9.92129434682532},{lat:57.009827895692105, lng:9.918601636742691},{lat:57.008383674982, lng:9.915346940914525},{lat:57.00852388334772, lng:9.91497679607047},{lat:57.009598562645905, lng:9.91723643132362},{lat:57.0105214795498, lng:9.919737006745185},{lat:57.01125750413894, lng:9.922226043353088},{lat:57.01187076835568, lng:9.92504743310068},{lat:57.01195839043086, lng:9.92555705281351},{lat:57.011724731104984, lng:9.925616061411837}]},
    path108: {
        name: "path108",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.0082974742206, lng:9.915367015243444},{lat:57.00742992119502, lng:9.913848884941014},{lat:57.00668671555342, lng:9.912813182910636},{lat:57.00597687020919, lng:9.912046071132377},{lat:57.00537557482505, lng:9.91133208962466},{lat:57.00419928385875, lng:9.910184185748907},{lat:57.00311075276121, lng:9.909438882155106},{lat:57.00178737320362, lng:9.908636936431119},{lat:56.999957249364364, lng:9.907574861713705},{lat:56.9978783410849, lng:9.906382784711235},{lat:56.99608783853351, lng:9.905108432889408},{lat:56.99476872115288, lng:9.9037922493395},{lat:56.993440593942815, lng:9.902085218489667},{lat:56.99246733777493, lng:9.900498948782799},{lat:56.99142451323756, lng:9.898480424967744},{lat:56.990182693660635, lng:9.895203095426432},{lat:56.98986839658154, lng:9.894404004600963},{lat:56.99004958909249, lng:9.894119690445384},{lat:56.990962579907844, lng:9.89670003924949},{lat:56.99180129382217, lng:9.898625865322183},{lat:56.99285288801674, lng:9.900514892778721},{lat:56.99421970446801, lng:9.902591580551746},{lat:56.99574376251796, lng:9.904315084249346},{lat:56.99720940197608, lng:9.905441092642473},{lat:56.99876142727979, lng:9.906423271129494},{lat:57.00023326280399, lng:9.907262609584912},{lat:57.001565151758584, lng:9.908036652953314},{lat:57.0030566317915, lng:9.908931130141191},{lat:57.004581665984425, lng:9.910071104888072},{lat:57.00579515268365, lng:9.9112155288095},{lat:57.00705122011032, lng:9.912681760935133},{lat:57.00771659388032, lng:9.913691717471735},{lat:57.00848229366193, lng:9.914876821406361},{lat:57.00830411190695, lng:9.915322068102833}]},
    path109: {
        name: "path109",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.05808311227787, lng:9.955511031191833},{lat:57.059365227436786, lng:9.953116001796344},{lat:57.06010614018058, lng:9.952193321895221},{lat:57.0616566088901, lng:9.9510822986706},{lat:57.062432477127516, lng:9.949966499720405},{lat:57.06326297814915, lng:9.949463889614591},{lat:57.06451586171206, lng:9.9492004261077},{lat:57.06575544254436, lng:9.949415002828891},{lat:57.06677107868839, lng:9.950021290257594},{lat:57.068075381686086, lng:9.951125538851237},{lat:57.069690990004496, lng:9.952402270342326},{lat:57.07277799041817, lng:9.954881778293325},{lat:57.07491640098559, lng:9.956771185286186},{lat:57.077897146911795, lng:9.959590481273013},{lat:57.07934866733608, lng:9.961723171391519},{lat:57.081423303828785, lng:9.966370236965826},{lat:57.08356173262249, lng:9.968264043652177},{lat:57.084662967288935, lng:9.970259067853936},{lat:57.08558407217524, lng:9.97254425452231},{lat:57.08648824856698, lng:9.975550366005729},{lat:57.08710619732181, lng:9.976988030037711},{lat:57.0881313269155, lng:9.980055181282776},{lat:57.08937730907612, lng:9.98466461346648},{lat:57.09026793304161, lng:9.988586772893958},{lat:57.091310061340664, lng:9.993082377132273},{lat:57.092529110199365, lng:9.998579262769981},{lat:57.093744683317546, lng:10.003888676818917},{lat:57.09574558446182, lng:10.012551394171645},{lat:57.09720210750167, lng:10.01898399997914},{lat:57.097452713643406, lng:10.020121256601454},{lat:57.09806465175389, lng:10.019895951044203},{lat:57.09663095228994, lng:10.014939228784682},{lat:57.09422199614269, lng:10.00472134384145},{lat:57.0922910935071, lng:9.996171725128935},{lat:57.09027828576182, lng:9.987349669659187},{lat:57.08847156997832, lng:9.979420124812926},{lat:57.087350214000736, lng:9.9747952068775},{lat:57.08606184597595, lng:9.97228465923956},{lat:57.08415326712336, lng:9.9682831567283},{lat:57.08266072615407, lng:9.965493659352811},{lat:57.08046375101259, lng:9.96201233114486},{lat:57.07883174598345, lng:9.959987188455557},{lat:57.07671100404288, lng:9.95770948641526},{lat:57.07418773848343, lng:9.955514487150591},{lat:57.07191638489463, lng:9.953460012017095},{lat:57.069157725409625, lng:9.95132497364124},{lat:57.06624107274665, lng:9.949018148833986},{lat:57.063962946051774, lng:9.948702929555227},{lat:57.06117336957989, lng:9.949973027057556},{lat:57.060121024675105, lng:9.951221724931617},{lat:57.05789919633216, lng:9.955171303932069},{lat:57.05807422333601, lng:9.955482440177796}]},
    path110: {
        name: "path110",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.04456731816524, lng:9.97326102333881},{lat:57.04396033362538, lng:9.973754549797551},{lat:57.043283300706506, lng:9.972939158257024},{lat:57.044007025095986, lng:9.970750475700871},{lat:57.044975859867, lng:9.970149660881535},{lat:57.04596801386411, lng:9.968454504784123},{lat:57.047270079504415, lng:9.966326639935401},{lat:57.04823882916653, lng:9.964030669018653},{lat:57.048927443079606, lng:9.961241171643165},{lat:57.050036201363625, lng:9.959803507611182},{lat:57.051401679236086, lng:9.959267065808204},{lat:57.05139000869776, lng:9.959953711316016},{lat:57.04916086862712, lng:9.961541579052833},{lat:57.048460587583186, lng:9.964052126690772},{lat:57.047795308360904, lng:9.96609060554209},{lat:57.047036642072925, lng:9.967506811901954},{lat:57.04614956645247, lng:9.96862261085215},{lat:57.045274142109555, lng:9.970038817212012},{lat:57.04505236466713, lng:9.970639632031348},{lat:57.044981308945964, lng:9.971009195289025},{lat:57.0447974657632, lng:9.971277416190514},{lat:57.0446486396631, lng:9.971470535239586},{lat:57.04452315837026, lng:9.971797764739403},{lat:57.044380167543096, lng:9.972248375853905},{lat:57.04419340318472, lng:9.97287064834536},{lat:57.044245930755416, lng:9.973176420173058},{lat:57.04454650375918, lng:9.973240793189415}]},
    path:    {
        name: "path",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.05544579883345, lng:9.903975041804824},{lat:57.05514681441531, lng:9.905450247123605},{lat:57.05506804615529, lng:9.905749313428766},{lat:57.0550658581457, lng:9.905794910982019},{lat:57.05490833269905, lng:9.906202396908421},{lat:57.0546954675668, lng:9.906740566324851},{lat:57.05446767779342, lng:9.907297089740123},{lat:57.054198258333635, lng:9.907990135699384},{lat:57.05408289701644, lng:9.908281572379613},{lat:57.05396182374542, lng:9.90865037611916},{lat:57.05369442660285, lng:9.909855517356604},{lat:57.05349895667151, lng:9.910869392364233},{lat:57.053205094582864, lng:9.912349942866431},{lat:57.05309422970503, lng:9.912961486521827},{lat:57.05307964219649, lng:9.91339063996421},{lat:57.05296294192165, lng:9.91413092965232},{lat:57.05290375839875, lng:9.914983099741374},{lat:57.052941686088765, lng:9.915889686388407},{lat:57.05294460360175, lng:9.916414507356732},{lat:57.05289500584941, lng:9.917047508684247},{lat:57.05286874818898, lng:9.917299636331647},{lat:57.05272559450457, lng:9.91766098900411},{lat:57.052617024723475, lng:9.91757701287682},{lat:57.0527576421172, lng:9.917019574248002},{lat:57.052800784462626, lng:9.916499739673656},{lat:57.05280758994279, lng:9.916007884347549},{lat:57.05278895228356, lng:9.915701039451935},{lat:57.05273381188437, lng:9.915123709948652},{lat:57.0527381881783, lng:9.91454167059242},{lat:57.05284074396665, lng:9.91373520070399},{lat:57.05293594736311, lng:9.913159652912324},{lat:57.05303342134724, lng:9.912908973748976},{lat:57.05323491061624, lng:9.91181360282881},{lat:57.05345266460774, lng:9.910661450598228},{lat:57.05366577996967, lng:9.909559727516303},{lat:57.05393903486595, lng:9.908411682527468},{lat:57.054303483318165, lng:9.907511092196199},{lat:57.054683887628876, lng:9.906554589210662},{lat:57.05497685900949, lng:9.905803982161187},{lat:57.055042499398965, lng:9.905691329382561},{lat:57.055242379333436, lng:9.904774978326806},{lat:57.055405749586164, lng:9.903954222368249},{lat:57.05544513337884, lng:9.903975344764241}]},
    path2:   {
        name: "path2",
        class: 100,
        type: "Road",
        color: "#008000",
    path: [{lat:57.05344853644534, lng:9.96459089894618},{lat:57.05259037645439, lng:9.966560902611977},{lat:57.051526956453394, lng:9.96855907694945},{lat:57.05055031168042, lng:9.969842466750842},{lat:57.049680826600685, lng:9.970680446749194},{lat:57.04881715683854, lng:9.97125980389641},{lat:57.04777435833657, lng:9.971698529228354},{lat:57.04680559655934, lng:9.971891648277426},{lat:57.04563115922062, lng:9.97230491504887},{lat:57.04460981455985, lng:9.972916458704265},{lat:57.04452810577375, lng:9.972337101557049},{lat:57.04467401419425, lng:9.97153243885258},{lat:57.04510006350186, lng:9.970931624033245},{lat:57.04654708041747, lng:9.970883663203178},{lat:57.04775170108087, lng:9.970714128430718},{lat:57.04937058798277, lng:9.96957254892699},{lat:57.051025817613485, lng:9.967546674478033},{lat:57.05215105748401, lng:9.965652367374535},{lat:57.05323104605435, lng:9.96396701814596},{lat:57.053452774662006, lng:9.964610748309534}]},
  };
//let data = JSON.stringify(paths_, null, 1);
//fs.writeFileSync('./data/paths.json', data);

let rawdata = fs.readFileSync('./data/paths.json');
let paths = JSON.parse(rawdata);
app.use(bodyParser.urlencoded({
    extended: true
}));
var routes = {
    approved: [],
    lat: {},
    lng: {},
    review: [],
    rejected: [],
};
var request = require("request");
const API_KEY = "AIzaSyDK_srYQ6mr32YHzvXhsLLbNs_ACYBf3bM";

port = process.env.PORT || 3000
const places = JSON.parse(fs.readFileSync('./data.txt',
            {encoding:'utf8', flag:'r'}));

app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.redirect("./html/index.html")
})

app.get("/get/uuid", (req, res) => {
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    let uuid = `${uuidv4()}-${secondsSinceEpoch}`;
    res.json({uuid: uuid, status:200, message:"OK"});
})

app.get("/get/paths", (req, res) => {
    res.json({paths: paths, status: 200, message: "OK"});
})


app.get("/get/approved/:uuid", (req, res) => {
    let sent = false;
    routes.approved.forEach(e => {
        console.log(e);
        if (e.uuid == req.params.uuid) {
            if (e.status == 200) {
                res.json({e: e, uuid: req.params.uuid, status:200});
                sent = true;
                return;
            }
        }
    })
    if (!sent) {
        routes.rejected.forEach(e => {
            console.log(e);
            if (e.uuid == req.params.uuid) {
                if (e.status == 201) {
                    res.json({e: e, uuid: req.params.uuid, status:201, reason: e.reason});
                    sent = true;
                    return;
                }
            }
        })
    }
    
    if (!sent) {
        res.json({status: 1})
    }
})


app.get("/approve_routes", (req, res) => {
    for (i = 0; i < routes.review.length; i++) {
        let route = routes.review.pop();
        console.log(route);
        route.data.route.forEach(ele => {
            routes.lat[ele.lat] = {lat: ele.lat,lng:ele.lng, class:route.data.truck.class}
            routes.lng[ele.lng] = {lng: ele.lng,lat: ele.lat, class:route.data.truck.class}
        })
        route.message = "Approved";
        route.status = 200;
        routes.approved.push(route);
    }
    res.json({status:200, message:"OK", routes:routes});
})

app.get("/approve/:uuid", (req, res) => {
    let uuid = req.params.uuid;
    routes.review.forEach(element => {
        if (element.uuid == uuid) {
            element.data.route.forEach(ele => {
                routes.lat[ele.lat] = {lat: ele.lat,lng:ele.lng, class:element.data.truck.class}
                routes.lng[ele.lng] = {lng: ele.lng,lat: ele.lat, class:element.data.truck.class}
            })
            element.message = "Approved";
            element.status = 200;
            routes.approved.push(element);
            for (i = 0; i < routes.review.length; i++) {
                if (routes.review[i].uuid == element.uuid) {
                    routes.review.splice(i, 1);
                    break;
                } 
            }
            return;
        }
    })
    
    res.json({status: 200, message: "OK", routes:routes});
})


app.get("/reject/:uuid/:reason", (req, res) => {
    let uuid = req.params.uuid;
    routes.review.forEach(element => {
        if (element.uuid == uuid) {
            console.log(element);
            element.message = "Rejected";
            element.status = 201;
            element.reason = req.params.reason;
            routes.rejected.push(element);
            for (i = 0; i < routes.review.length; i++) {
                if (routes.review[i].uuid == element.uuid) {
                    routes.review.splice(i, 1);
                    break;
                } 
            }
            return;
        }
    })
    
    res.json({status: 200, message: "OK", routes:routes});
})

app.get("/reject_routes", (req, res) => {
    for (i = 0; i < routes.review.length; i++) {
        let route = routes.review.pop();
        console.log(route);
        route.message = "Rejected";
        route.status = 201;
        route.reason = "Unspecified";
        routes.rejected.push(route);
    }
    res.json({status:200, message:"OK", routes:routes});
})

app.get("/get/routes", (req, res) => {
    res.json({routes: routes, status:200});
})
function diff(a, b) { return Math.abs(a - b); };
function check_if_route_exists(data) {
    let coords = [...data.route];
    let exit = false;
    for (i = 0; i < coords.length; i++) {
        exit = false;
        for (const [key, value] of Object.entries(routes.lat)) {
            if (diff(value.lat, coords[i].lat) <= requirement) {
                for (const [key, value] of Object.entries(routes.lng)) {
                    if (diff(value.lng, coords[i].lng) <= requirement) {
                        if (value.class >= data.truck.class) {
                            coords.splice(i, 1);
                            console.log({coords:coords[i], i:i});
                            i--;
                            exit = true;
                            break;
                        }
                    }     
            }
            }
            if (exit) {break;}
        }
    }

    if (coords.length == 0) {
        return true;
    }
    return false;
}

function checkroute(data) {
    let message = "Waiting for approval";
    let status = 201;
    data = parse_data(data);
    if (check_if_route_exists(data)) {
        status = 200;
        message = "APPROVED";
    } else {
        console.log("Cheking route");
        data.events.forEach(e => {
            if (e.class < data.truck.class && e.class != null) {
                status = 203;
                message = "Class Exeeced"
                return
            }
        });
    }
    return [status, message, data];
}

function parse_data(data) {
    data.route.forEach(e => {
        e.lat = parseFloat(e.lat.toFixed(5));
        e.lng = parseFloat(e.lng.toFixed(5));
    })
    return data;
}

app.post("/checkroute", (req, res) => {
    let body = req.body;
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    let uuid = `${uuidv4()}-${secondsSinceEpoch}`;
    let data = checkroute(body);
    data.uuid = uuid;
    if (data[0] === 201) {
        routes.review.push({status: data[0], message:data[1], data:data[2], uuid:uuid});
    }
    res.json({status: data[0], message: data[1], data:data[2], uuid:uuid})
})

