module TagCloud
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each do |page|
        page.content += "<p>Dummy plugin is running!</p>"
      end
    end
  end
end