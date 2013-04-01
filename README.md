TableFixedHeader
==================

This project is cloned from https://github.com/benjaminleouzon/tablefixedheader,
but I want to implement a theme just like bootstrap, so I add `theme_bootstrap.css`
to the project.

## Usage

The code just like:

```
<script type="text/javascript" src="http://code.jquery.com/jquery.min.js"></script>
<link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.1.1/css/bootstrap.min.css" rel="stylesheet">
<link href="../css/jquery.fixheadertable.css" rel="stylesheet">
<link href="../css/theme_bootstrap.css" rel="stylesheet">
<script type="text/javascript" src="../javascript/jquery.fixheadertable.js"></script>
```

And the script is:

```
<table class="fixme table table-bordered table-striped table-condensed">
    <thead>
        <tr>
            <th>Col 1</th>
            <th>Col 2</th>
            <th>Col 3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>XXX</td>
            <td>YYY</td>
            <td>ZZZ</td>
        </tr>
    </tbody>
</table>
<script type="text/javascript">
    $(document).ready(function() {
        $('.fixme').fixheadertable({
            colratio    : [100, 150, '*'], 
            resizeCol:true, width:600, height: 200, 
            theme:'bootstrap'});
    });
</script>
```

You can use bootstrap table class such as: `table table-bordered table-striped table-condensed` .