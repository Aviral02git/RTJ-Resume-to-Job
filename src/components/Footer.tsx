'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-t border-blue-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Data Career Explorer</h3>
            <p className="text-gray-600 text-sm">
              Skill-first guidance for data careers with compatibility scoring and practical prep roadmaps.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Explorer</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#skills" className="hover:text-blue-600 transition-colors">Select Skills</a></li>
              <li><a href="#roles" className="hover:text-blue-600 transition-colors">Role Matches</a></li>
              <li><a href="#roles" className="hover:text-blue-600 transition-colors">30-Day Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Popular Roles</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#roles" className="hover:text-blue-600 transition-colors">Data Analyst</a></li>
              <li><a href="#roles" className="hover:text-blue-600 transition-colors">Data Scientist</a></li>
              <li><a href="#roles" className="hover:text-blue-600 transition-colors">Data Engineer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Notes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">India-focused salary bands</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">For learning guidance only</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Iterate with projects weekly</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 pt-8">
          <p className="text-center text-gray-600 text-sm">
            &copy; {currentYear} Data Career Explorer. Build skills, validate fit, and grow with confidence.
          </p>
        </div>
      </div>
    </footer>
  );
}
