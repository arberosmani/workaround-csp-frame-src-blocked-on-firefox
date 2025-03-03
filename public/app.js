function createIFrame(a) {
  var iFrame = document.createElement("iframe");
  iFrame.id = `_${crypto.randomUUID()}`;
  iFrame.style.display = 'none';

  const htmlCode = `
    <body>
      <script>
        var a = document.createElement('a');
        a.innerText = '${a.innerText}';
        a.setAttribute('href', '${a.href}');
        a.setAttribute('download', '${a.download}');
        a.onclick = () => setTimeout(() => parent.document.querySelector('#${iFrame.id}').remove(), 100);
        document.body.appendChild(a);
        a.click();
      </script>
    </body>
  `;

  const blobContent = new Blob([htmlCode], {type: "text/html"});
  iFrame.src = URL.createObjectURL(blobContent);
  this.document.body.appendChild(iFrame);
}

document.addEventListener('DOMContentLoaded', () => {
  const iframeElement = document.querySelector('iframe');

  iframeElement.contentWindow.addEventListener('load', function() {
    iframeElement.contentDocument.addEventListener('click', (e) => {
      let target = e.target.closest('a');
      const enableFix = document.querySelector('#enableFix').checked;
      if (enableFix && target && target.href.startsWith('blob:')) {
        e.preventDefault();
        createIFrame.apply(this, [target]);
      }
    });
  });
});

/** Not relevant to the issue */
let errorCounter = 0;
addEventListener("securitypolicyviolation", () => {
  errorCounter++;
  const hintElement = document.querySelector('#hint');
  hintElement.innerText = `See console error (${errorCounter}).`;
});