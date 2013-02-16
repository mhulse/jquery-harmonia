# jQuery Harmonia

### Replace an (un)ordered list with a form select.

---

#### USAGE

Put [jQuery](http://jquery.com/) on your page:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
```

… and link to the plugin:

```html
<script src="jquery.harmonia.min.js"></script>
```

Put some `html` on the page:

```html
<ul class="myList">
	<li><a href="http://en.wikipedia.org/wiki/Hebe_(mythology)">Hebe</a></li>
	<li><a href="http://en.wikipedia.org/wiki/Hebe_(mythology)">Hedone</a></li>
	<li><a href="http://en.wikipedia.org/wiki/Nike_(mythology)">Nike</a></li>
	<li><a href="#">No link</a></li>
	<li><a href="http://en.wikipedia.org/wiki/Angelos_(Greek_mythology)">Angelos</a></li>
	<li><a href="http://en.wikipedia.org/wiki/Erinyes">Erinyes</a></li>
	<li><a class="selected" href="http://en.wikipedia.org/wiki/Cronus">Cronus</a></li>
	<li><a href="http://en.wikipedia.org/wiki/Ceto">Ceto</a></li>
</ul>
```

Next, instantiate the plugin:

```html
<script>
	<!--
		
		$('.myList').harmonia();
		
	//-->
</script>
```

Use CSS media queries to show/hide the HTML list/form select(s) as necessary.

---

#### OPTIONS

* `currentPage`: Select the current page? Default: `false`.
* `defaultOption`: Default option for `<select>`. Default: `Choose…`.
* `openTab`: Open link in new tab? Default is current window. Default: `false`.
* `selectClass`: Class name for `<select>`. Default: `harmonia-select`.
* `selectId`: ID name for `<select>`. Default: `false`.

**Callbacks:**

* `onInit`: After plugin data initialized.
* `onAfterInit`: After plugin initialization.
* `onAddOption`: Called when a new option has been added.
* `onChange`: Called when `<select>` changes.

---

#### DEMO

[![qr code](http://chart.apis.google.com/chart?cht=qr&chl=https://github.com/registerguard/jquery-harmonia/&chs=240x240)](http://registerguard.github.com/jquery-harmonia/demo/)

Scan QR code with phone and/or click to [view the latest demo](http://registerguard.github.com/jquery-harmonia/demo/). Resize the browser window to see the plugin(s) in action (Firefox 15+ users, check out [Responsive Design View](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_View)).

---

#### LEGAL

Copyright © 2013 [Micky Hulse](http://hulse.me)/[The Register-Guard](http://registerguard.com)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.