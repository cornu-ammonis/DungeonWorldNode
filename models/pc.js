// player character module

module.exports = function pc(name, str, int, dex, wis, con, cha, hpbase) {
	this.name = name;
	this.str = str;
	this.int = int;
	this.dex = dex;
	this.wis = wis;
	this.con = con;
	this.cha = cha;
	
	this.hpbase = hpbase;
	this.maxhp = (this.hpbase + this.con);
	this.currenthp = this.maxhp;
}