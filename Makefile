serve:

	cd ./src/assets/data/; serve -p 3010 -C;

R:

	Rscript -e "rmarkdown::render('data/2016-01-14_2016-primaries-smt.Rmd')"
	open data/2016-01-14_2016-primaries-smt.html

R_deploy:

	cp data/2016-01-14_2016-primaries-smt.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/2016-01-14_2016-primaries-smt_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/2016-01-14_2016-primaries-smt.html
