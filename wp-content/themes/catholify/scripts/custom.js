// Start: Fundraise Up
;(function (w, d, s, n, a) {
  if (!w[n]) {
    var l = "call,catch,on,once,set,then,track".split(","),
      i,
      o = function (n) {
        return "function" == typeof n
          ? o.l.push([arguments]) && o
          : function () {
              return o.l.push([n, arguments]) && o
            }
      },
      t = d.getElementsByTagName(s)[0],
      j = d.createElement(s)
    j.async = !0
    j.src = "https://cdn.fundraiseup.com/widget/" + a
    t.parentNode.insertBefore(j, t)
    o.s = Date.now()
    o.v = 4
    o.h = w.location.href
    o.l = []
    for (i = 0; i < 7; i++) o[l[i]] = o(l[i])
    w[n] = o
  }
})(window, document, "script", "FundraiseUp", "AJSVVMVN")

// Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAHelhpMzSngI6vnbc8lv9XqaLMswIo_ds",
  authDomain: "catholify-cc548.firebaseapp.com",
  databaseURL: "https://catholify-cc548.firebaseio.com",
  projectId: "catholify-cc548",
  storageBucket: "catholify-cc548.appspot.com",
  messagingSenderId: "716046641538",
  appId: "1:716046641538:web:603be4472872a7a07d079b",
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Start: Google Analytics
window.dataLayer = window.dataLayer || []

function gtag() {
  dataLayer.push(arguments)
}
gtag("js", new Date())
gtag("config", "UA-159589120-1")
// End: Google Analytics

window.Catholify = (function () {
  const loaded = Date.now()
  const cache = {}
  const callbacks = {}
  const listeners = {}
  
  const YOUTUBE_API_KEY = `AIzaSyAe63GWovu4ATvFMDe0vnFSkBI2M8YQbWA`
  const VIDEO_ID = `am72_e-h9d8`

  const handleDonationComplete = async (details) => {
    const { userId, nonce } = details.customFields
    if (!userId || !nonce) return
    const url = "https://us-central1-catholify-cc548.cloudfunctions.net/handleDonationComplete"
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
  }

  const getQueryString = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // A really cool thing to detect in the querystring and launch a popup, but went with a page-specific
  // approach rather than global. Leaving it here in case we want to do something similar later:
  // const checkForOffering = async () => {
  //   const offeringId = getQueryString('offering')
  //   if(offeringId) {
  //     const offering = await firebase.firestore().collection('offerings').doc(offeringId).get()
  //     const data = offering.data() || {}
  //     elementorFrontend.documentsManager.documents['1246'].showModal(); // whatever the id of your Popup is...
  //     document.getElementById("catholify-offering-header").innerText = data.test;
  //   }
  // }
  // checkForOffering()

  if (window.FundraiseUp) {
    window.FundraiseUp.on("donationComplete", handleDonationComplete.bind(this))
    console.log("Fundraise Up callback registered.")
  }

  const addCallback = (type, callback) => {
    if (!callbacks[type]) callbacks[type] = []
    callbacks[type].push(callback)
	  
	if (type === "stats" && cache[type]) {
		try {
			const {ref, snap} = cache[type]
			if (typeof callback === "function") callback.apply(ref, [snap])
		} catch(err) {
			console.error(err)
		}
	}
  }

  const removeCallback = (type, callback) => {
    if (callbacks[type]) {
      const index = callbacks[type].indexOf(call)
      if (index > -1) {
        callbacks[type].splice(index, 1)
      }
    }
  }

  const getAdorecastViewerCount = async () => {
    if (!cache.adorecast) {
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${VIDEO_ID}&key=${YOUTUBE_API_KEY}&part=liveStreamingDetails`
      try {
        const result = await fetch(url)
        const json = await result.json()
        const count = parseInt(json.items[0].liveStreamingDetails.concurrentViewers)
        cache.adorecast = count
        return cache.adorecast
      } catch (err) {
        console.error(err)
        return 0
      }
    } else {
      return cache.adorecast
    }
  }

  const getPlogs = async () => {
    if (!cache.plogs) {
      const url = "https://us-central1-catholify-cc548.cloudfunctions.net/plogStats"
      try {
        const result = await fetch(url)
        const { plogs } = await result.json()
        cache.plogs = plogs
        return cache.plogs
      } catch (err) {
        console.error(err)
        return 0
      }
    } else {
      return cache.plogs
    }
  }

  const upsertOffering = async (data, offeringId) => {
    let offering
    if(offeringId) {
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp()
      offering = await firebase.firestore().collection('offerings').doc(offeringId).set(data)
    } else {
      const quotes = 
      [["The Rosary is the Weapon.", "St. Padre Pio"],
      ["The Rosary is my favorite prayer.", "St. Pope John Paul II"],
      ["The greatest method of praying is to pray the Rosary.", "Saint Francis de Sales"],
      ["When the Holy Rosary is said well, it gives Jesus and Mary more glory and is more meritorious than any other prayer.", "Saint Louis de Montfort"],
      ["The Holy Rosary is the storehouse of countless blessing.", "Blessed Alan de la Roche"],
      ["One day, through the Rosary and the Scapular, Our Lady will save the world.", "Saint Dominic"],
      ["Never will anyone who says his Rosary every day be led astray. This is a statement that I would gladly sign with my blood.", "Saint Louis de Montfort"],
      ["The Rosary is the most beautiful and the most rich in graces of all prayers", "Pope Saint Pius X"],
      ["After the Holy Sacrifice of the Mass, there is nothing in the Church that I love as much as the Rosary", "Our Lady to Blessed Alan de la Roche"],
      ["Pray very much the prayers of the Rosary. I alone am able to save you from the calamities.", "Mary in Akita, Japan"],
      ["If you want to reach these hardened souls and win them over to God, preach my Rosary", "Our Lady to St. Dominic"],
      ["When you give a sermon, urge people to say my Rosary, and in this way your words will bear much fruit for souls.", "Our Lady to St. Dominic"],
      ["It was not courage, not arms, not leaders, but Mary of the Rosary that made us victors.", "Venetian Senators after Battle of Lepanto"],
      ["How beautiful is the family that recites the Rosary every evening!", "St. Pope John Paul II"],
      ["The Rosary is a prayer both so humble and simple and a theologically rich in Biblical content. I beg you to pray it.", "St. Pope John Paul II"],
      ["The Rosary is the Bible on a String", "Fr. Ronan Murphy"],
      ["No one can live continually in sin and continue to say the Rosary: either they will give up sin or they will give up the Rosary", "Bishop Hugh Doyle"],
      ["If you say the Holy Rosary every day, with a spirit of faith and love, our Lady will make sure she leads you very far along her Son's path", "St. Josemaria Escriva"],
      ["Say the Holy Rosary. Blessed be that monotony of Hail Mary's which purifies the monotony of your sins!", "St. Josemaria Escriva"],
      ["The Rosary is the 'weapon' for these times.", "Saint Padre Pio"],
      ["There is no surer means of calling down God's blessings upon the family... than the daily recitation of the Rosary", "Pope Pius XII"],
      ["The Rosary is a magnificent and universal prayer for the needs of the Church, the nations and the entire world.", "Pope John XXIII"],
      ["The holy Rosary is a powerful weapon. Use it with confidence and you'll be amazed at the results.", "St. Josemaria Escriva"],
      ["The Rosary is a priceless treasure inspired by God.", "St. Louis De Monfort"],
      ["When people love and recite the Rosary they find it makes them better.", "St. Anthony Mary Claret"],
      ["Continue to pray the Rosary every day.", "Our Lady of Fatima to Sister Lucia"],
      ["You shall obtain all you ask of me by the recitation of the Rosary.", "Our Lady to Blessed Alan de la Roche"],
      ["We put great confidence in the Holy Rosary for the healing of evils which afflict our times.", "Pope Pius XII"],
      ["The Rosary is a school for learning true Christian perfection.", "Pope John XXIII"],
      ["Those who say the Rosary frequently and fervently will gradually grow in grace and holiness and will enjoy the special protection of Our Lady and the abiding friendship of God", "Bishop Hugh Boyle"],
      ["The Family that prays together, stays together.", "Father Patrick Peyton"],
      ["The whole purpose of the Rosary is to lead to this deep experience of Our Lady, who together with Jesus breathes the Spirit into us.", "Thomas Keating"],
      ["Give me an army saying the Rosary and I will conquer the world.", "Blessed Pope Pius IX"],
      ["Our Lady has never refused me a grace through the recitation of the Rosary.", "St. Padre Pio"],
      ["I take refuge, then, in prayer, and turn to Mary, and our Lord always triumphs.", "St. Therese of Lisieux"],
      ["The Rosary is the best therapy for these distraught, unhappy, fearful, and frustrated souls, precisely because it involves the simultaneous use of three powers: the physical, the vocal, and the spiritual…", "Archbishop Fulton J. Sheen"],
      ["There is no problem, I tell you, no matter how difficult it is, that we cannot solve by the prayer of the Holy Rosary.", "Sister Lucia, of the seers of Fatima"],
      ["Let us run to Mary, and, as her little children, cast ourselves into her arms with a perfect confidence.", "St. Francis de Sales"],
      ["No prayer is more meritorious for the soul and more glorious for Jesus and Mary than a well recited Rosary.", "St. Louis De Monfort"],
      ["The Rosary is the scourge of the devil.", "Pope Adrian VI"],
      ["In the Rosary, we not only say prayers, we think them.", "Archbishop Fulton J. Sheen"],
      ["If you recite the Family Rosary, all united, you shall taste peace.", "Pope John XXIII"],
      ["The Rosary is a treasure of graces.", "Pope Paul V"]]
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      data.quote = quote[0]
      data.quoteBy = quote[1]
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp()
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp()
      offering = await firebase.firestore().collection('offerings').add(data)
    }
    return offering.id
  }

  const getOffering = async (id) => {
      const offering = await firebase.firestore().collection('offerings').doc(id).get()
      return offering.data()
  }

  const registerStatListener = () => {
    if (listeners["stats"]) return

    const ref = firebase.firestore().collection("globals").doc("public")

    const onSnapshot = (snap) => {
	  cache["stats"] = {ref, snap}
      for (const callback of callbacks["stats"]) {
		try {
        	if (typeof callback === "function") callback.apply(ref, [snap])
		} catch(err) {
			console.error(err)
		}
      }
    }

    const onSnapshotError = (err) => {
      for (const callback of callbacks["stats"]) {
		try {
       		if (typeof callback === "function") callback.apply(ref, [null, err])
		} catch(err) {
			console.error(err)
		}
      }
    }

    const deregisterListener = ref.onSnapshot(onSnapshot, onSnapshotError)
    listeners["stats"] = deregisterListener
  }

  const registerAdorecastListener = async () => {
    if (listeners["adorecast"]) return

    const adoring = await getAdorecastViewerCount()

    let prevHolyHours = 0
    const increment = () => {
      const now = new Date()
      const difference = (now - loaded) / 1000
      const holyHours = (adoring * difference) / 60 / 60

      for (const callback of callbacks["adorecast"]) {
		try {
        	if (typeof callback === "function") callback.apply(null, [{ adoring, prevHolyHours, holyHours }])
		} catch (err) {
			console.error(err)
		}
      }
      prevHolyHours = holyHours
    }

    const interval = setInterval(increment, 1000)
    listeners["adorecast"] = interval
  }

  const parsePrayerMinutes = (loggedPrayerMinutes) => {
    const prayerMinutes = loggedPrayerMinutes
    const dayDivisor = 24 * 60
    const yearDivisor = 365.25 * dayDivisor
    const yearsRemainder = prayerMinutes % yearDivisor
    const daysRemainder = yearsRemainder % dayDivisor

    const years = Math.floor(prayerMinutes / yearDivisor)
    const days = Math.floor(yearsRemainder / dayDivisor)
    const hours = daysRemainder / 60

    return { years, days, hours }
  }

  const logPlog = async (type, quantity) => {
    quantity = quantity || 1
    const duration = quantity * 18 // ish minutes to say a Rosary

     await firebase.firestore().collection('plogs').add({
      prayerTitle: type,
      duration,
      quantity,
      // userName: req.body.name,
      // comment: req.body.intention,
      sourcePath: 'website',
      // isPublic: isPublic,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  return {
    addCallback,
    removeCallback,
    registerStatListener,
    registerAdorecastListener,
    getPlogs,
    parsePrayerMinutes,
    upsertOffering,
    getOffering,
    logPlog
  }
})()
