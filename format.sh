# discord-tests-generate, generate example json data using the discord
# api designated for the Nova's Gateway tests.
# This file formats all the json file into readeable json.
# 
# Copyright (C) 2021  Nova
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

for f in data/*.json
do
	echo "Prettify - $f"
	# always "double quote" $f to avoid problems
	cat $f | jq . > pretty/$f
done
