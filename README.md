# 2016-primaries-smt

![tables](https://cloud.githubusercontent.com/assets/370976/12398677/26b21142-bde3-11e5-81db-211142430e65.png)

## Developers

#### Setup

- `npm i`

## Producers

#### How to create a new table

Create a new *.jpt* with the following content - e.g. Iowa Democratic caucuses:

```html
<!-- MODIFY THE ID FIELD IN THE FOLLOWING LINE -->
<div id='bg-primaries-smt-caucuses-democratic-iowa' style='margin: 20px 0;'></div>
<script src='http://apps.bostonglobe.com/common/js/pym/pym-0.4.5.min.js'></script>
<script>

	// MODIFY THESE THREE VARIABLES
	var raceType  = 'caucuses';   // e.g. caucuses, primary
	var party     = 'democratic'; // e.g. democratic, republican
	var state     = 'iowa';       // e.g. new hampshire, alaska

	// THIS MUST THE SAME AS THE ID ABOVE IN THE DIV
	var uniqueId  = 'bg-primaries-smt-caucuses-democratic-iowa';

	var baseurl   = 'http://dev.apps.bostonglobe.com/graphics/2016/02/state-results-small-table';
	var url       = [baseurl, '?raceType=', raceType, '&party=', party, '&state=', state].join('');
	var pymParent = new pym.Parent(uniqueId, url, {});
</script>
```

*Note:* make sure that the id field is unique in the page. In other words, make sure there are no other elements with that id or the graphic won't work.

Slot the jpt in your article or section front and you're done.
