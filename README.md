# 2016-primaries-smt

This is a graphic that displays live state-wide primary results table on election night. It works at various widths starting at 171px:

![tables](https://cloud.githubusercontent.com/assets/370976/12398677/26b21142-bde3-11e5-81db-211142430e65.png)

- [How to create a new table](#how-to-create-a-new-table)
- [Developer setup](#setup)

## Producers

#### How to create a new table

We're going to create a table for the Iowa Democratic caucuses. Create a new *.jpt* with the following content, and modify accordingly.

```html
<!-- MODIFY: the id field in the following line-->
<div id='bg-primaries-smt-caucuses-democratic-iowa' style='margin: 20px 0;'></div>

<script src='https://apps.bostonglobe.com/common/js/pym/pym-0.4.5.min.js'></script>
<script>

	// MODIFY: these three variables
	var raceType  = 'caucuses';   // e.g. caucuses, primary
	var party     = 'democratic'; // e.g. democratic, republican
	var state     = 'iowa';       // e.g. new hampshire, alaska

	// MODIFY: make sure this is the same as the id field in the first line
	var uniqueId  = 'bg-primaries-smt-caucuses-democratic-iowa';

	var baseurl   = 'http://dev.apps.bostonglobe.com/graphics/2016/02/state-results-small-table';
	var url       = [baseurl, '?raceType=', raceType, '&party=', party, '&state=', state].join('');
	var pymParent = new pym.Parent(uniqueId, url, {});
</script>
```

**Note:** make sure that the id field is unique in the page. In other words, make sure there are no other elements with that id or the graphic won't work.

Slot the *.jpt* in your article or section front and you're done.

## Developers

#### Setup

- `npm i`

