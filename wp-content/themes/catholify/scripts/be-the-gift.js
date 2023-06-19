window.addEventListener("load", async function () {
  const jsonUrl = "/wp-content/themes/catholify/assets/be-the-gift-ideas.json"
  const response = await fetch(new Request(jsonUrl))
  const suggestions = await response.json()
  let isAnimationReady = true
  let suggestionIndex = 0

  const unwrapButton = document.querySelector("#unwrap-button")
  const giftsUnwrappedButton = document.querySelector("#gifts-unwrapped-button")
  const giftsUnwrappedButtonTextEl = document.querySelector("#gifts-unwrapped-button span.elementor-button-text")
  const lottieEl = document.querySelector("#lottie-player")

  const handleSnapshot = (doc) => {
    const { beTheGiftButtonClicks } = doc.data()
    giftsUnwrappedButton.classList.add("fade-in")
    giftsUnwrappedButtonTextEl.innerHTML = `${beTheGiftButtonClicks} Gifts Unwrapped!`
  }

  const handleSnapshotError = (error) => {
    console.log(error)
  }

  const registerStatListener = async () => {
    const doc = firebase.firestore().collection("globals").doc("public")
    doc.onSnapshot(handleSnapshot, handleSnapshotError)
  }

  const log = async () => {
    const url = "https://us-central1-catholify-cc548.cloudfunctions.net/beTheGift"
    return await fetch(url, { method: "post" })
  }

  const unwrap = async (e) => {
    if (e) e.preventDefault()
    if (isAnimationReady) {
      isAnimationReady = false
      suggestionIndex = Math.floor(Math.random() * suggestions.length)
      lottieEl.getLottie().goToAndPlay(0, true)
      await log()
    }
    return false
  }

  const goToNewsletterSection = function (e) {
    e.preventDefault()
    Swal.close()
    setTimeout(async () => {
      const element = document.querySelector("#newsletter input[type=email]")
      const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement
      await anime({
        targets: scrollElement,
        scrollTop: element.getBoundingClientRect().top - 250,
        duration: 500,
        easing: "easeInOutQuad",
      })
      element.focus()
    }, 600)
  }

  const goToDonateSection = () => {
    Swal.close()
    setTimeout(async () => {
      const element = document.querySelector("#donate")
      const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement
      await anime({
        targets: scrollElement,
        scrollTop: element.getBoundingClientRect().top,
        duration: 500,
        easing: "easeInOutQuad",
      })
      element.focus()
    }, 550)
  }

  const displayModal = async () => {
    const shareText = `I challenge you to Be The Gift with me this Advent and Christmas by doing acts of kindness to those around us! Unwrap your gift at catholify.com/bethegift`
    const result = await Swal.fire({
      html: `
        <div className="suggestion-container">
          <p>May we suggest:</p>
          <h3 className="suggestion suggestion-text has-text-centered">
            ${suggestions[suggestionIndex]}
          </h3>
          <p>
            Now go Be The Gift and challenge 3 others to do the same. Let's spread the joy of Christ this season!
          </p>
          <div className="social-icons">
            <div className="columns is-mobile">
              <div className="column is-4 has-text-centered">
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fcatholify.com%2Fbethegift&quote=${encodeURIComponent(
                    shareText
                  )}"}>
                  <span className="icon fab fa-facebook fa-2x"></span>
                </a>
              </div>
              <div className="column is-4 has-text-centered">
                <a href="https://twitter.com/intent/tweet?source=http%3A%2F%2Fcatholify.com%2Fbethegift&text=${encodeURIComponent(
                  shareText
                )}">
                  <span className="icon fab fa-twitter fa-2x"></span>
                </a>
              </div>
              <div className="column is-4 has-text-centered">
                <a href="mailto:?subject=&body=${encodeURIComponent(shareText)}">
                  <span className="icon fas fa-envelope fa-2x"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="my-2"></div>
        </div>
      `,
      confirmButtonText: "Unwrap Another",
      denyButtonText: "<i class='fa fa-heart'></i> Give the Gift",
      showDenyButton: true,
      showCloseButton: true,
      didOpen: (dom) => {
        const goToNewsletterButton = document.getElementById("go-to-newsletter-button")
        goToNewsletterButton.onclick = goToNewsletterSection
      },
    })
    console.log(result)

    if (result.isConfirmed) unwrap()
    else if (result.isDenied) goToDonateSection()
  }

  const handleLottieFrameEvent = (e) => {
    const { currentFrame, totalFrames } = lottieEl.getLottie()
    const stopFrame = totalFrames - 25
    if (currentFrame > stopFrame) {
      lottieEl.pause()
      isAnimationReady = true
      displayModal()
    }
  }

  lottieEl.addEventListener("frame", handleLottieFrameEvent)
  unwrapButton.addEventListener("click", unwrap)

  registerStatListener()
})
