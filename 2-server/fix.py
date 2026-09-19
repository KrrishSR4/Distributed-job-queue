import glob

for f in glob.glob('internal/workers/*_test.go'):
    content = open(f).read()
    content = content.replace('" test-instance\\,', '"test-instance",')
    open(f, 'w').write(content)
