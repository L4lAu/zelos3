import { useState } from "react";

export default function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  

  return (
    // Aplicando o gradiente linear ao fundo do header
    <header className="bg-[linear-gradient(120deg,#000000,#1e2128,#282c34)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Título */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Sistema Zelos</h1>
          </div>

          {/* Usuário */}
          <div className="flex items-center">
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none hover:bg-white/10 rounded-lg px-2 py-1 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-sm font-medium text-white">
                  {user.username}
                </span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  {/* Cor do texto do avatar alterada para uma do gradiente */}
                  <span className="text-[#1e2128] text-sm font-semibold">
                    {user.username}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#282c34] border border-gray-700 rounded-md shadow-xl py-1 z-10">
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
                    href="http://localhost:3000/"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
